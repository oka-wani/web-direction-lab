export type CalendarEnv = {
  GOOGLE_CALENDAR_CLIENT_ID: string;
  GOOGLE_CALENDAR_CLIENT_SECRET: string;
  GOOGLE_CALENDAR_REFRESH_TOKEN: string;
  GOOGLE_CALENDAR_ID: string;
};

type TokenResult = { access_token?: string };
type BusyWindow = { start: string; end: string };
type FreeBusyResult = { calendars?: Record<string, { busy?: BusyWindow[]; errors?: { reason?: string }[] }> };
type CalendarListResult = {
  items?: { id?: string; selected?: boolean; hidden?: boolean; deleted?: boolean }[];
  nextPageToken?: string;
};
export type CalendarEvent = { id: string; htmlLink?: string; hangoutLink?: string; conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] } };

const configured = (value: string | undefined) => Boolean(value && !value.startsWith("SET_IN_"));

export async function getGoogleAccessToken(env: CalendarEnv) {
  if (!configured(env.GOOGLE_CALENDAR_CLIENT_ID) || !configured(env.GOOGLE_CALENDAR_CLIENT_SECRET) || !configured(env.GOOGLE_CALENDAR_REFRESH_TOKEN)) {
    throw new Error("Google Calendar credentials are not configured");
  }
  const body = new URLSearchParams({
    client_id: env.GOOGLE_CALENDAR_CLIENT_ID,
    client_secret: env.GOOGLE_CALENDAR_CLIENT_SECRET,
    refresh_token: env.GOOGLE_CALENDAR_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error(`Google token error: ${response.status}`);
  const result = await response.json() as TokenResult;
  if (!result.access_token) throw new Error("Google access token missing");
  return result.access_token;
}

async function getAvailabilityCalendarIds(env: CalendarEnv, accessToken: string) {
  const configuredCalendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
  const ids = new Set<string>([configuredCalendarId]);
  let pageToken = "";
  do {
    const url = new URL("https://www.googleapis.com/calendar/v3/users/me/calendarList");
    url.searchParams.set("maxResults", "250");
    url.searchParams.set("showDeleted", "false");
    url.searchParams.set("showHidden", "false");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) throw new Error(`Google calendarList error: ${response.status}`);
    const result = await response.json() as CalendarListResult;
    for (const calendar of result.items ?? []) {
      if (calendar.id && calendar.selected && !calendar.hidden && !calendar.deleted) ids.add(calendar.id);
    }
    pageToken = result.nextPageToken ?? "";
  } while (pageToken);
  return [...ids];
}

export async function getCalendarBusyWindows(env: CalendarEnv, accessToken: string, start: Date, end: Date) {
  const calendarIds = await getAvailabilityCalendarIds(env, accessToken);
  const queriedCalendarIds = calendarIds.slice(0, 50);
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: "Asia/Tokyo", calendarExpansionMax: 50, items: queriedCalendarIds.map((id) => ({ id })) }),
  });
  if (!response.ok) throw new Error(`Google freeBusy error: ${response.status}`);
  const result = await response.json() as FreeBusyResult;
  const failedCalendars = queriedCalendarIds.filter((id) => (result.calendars?.[id]?.errors?.length ?? 0) > 0);
  if (failedCalendars.length) throw new Error(`Google freeBusy calendar error: ${failedCalendars.length}`);
  return queriedCalendarIds.flatMap((id) => result.calendars?.[id]?.busy ?? []);
}

export async function isCalendarSlotFree(env: CalendarEnv, accessToken: string, start: Date, end: Date) {
  const busy = await getCalendarBusyWindows(env, accessToken, start, end);
  return !busy.some((window) => new Date(window.start) < end && new Date(window.end) > start);
}

export async function createMeetingEvent(env: CalendarEnv, accessToken: string, input: { token: string; customerName: string; customerEmail: string; company: string; start: Date; end: Date; mode: "online" | "in-person"; location?: string }) {
  const calendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
  const eventId = `a${input.token}`;
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const eventBody: Record<string, unknown> = {
    id: eventId,
    summary: `Wani san Web 初回お打ち合わせ｜${input.company || `${input.customerName}様`}`,
    description: "Webサイト制作に関する初回お打ち合わせ",
    start: { dateTime: input.start.toISOString(), timeZone: "Asia/Tokyo" },
    end: { dateTime: input.end.toISOString(), timeZone: "Asia/Tokyo" },
    attendees: [{ email: input.customerEmail }],
  };
  if (input.mode === "online") {
    eventBody.conferenceData = { createRequest: { requestId: `meet-${input.token}`, conferenceSolutionKey: { type: "hangoutsMeet" } } };
  } else {
    eventBody.location = input.location;
  }
  const response = await fetch(`${endpoint}?conferenceDataVersion=1&sendUpdates=none`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(eventBody),
  });
  if (response.status === 409) {
    const existing = await fetch(`${endpoint}/${eventId}?conferenceDataVersion=1`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!existing.ok) throw new Error(`Google existing event error: ${existing.status}`);
    return existing.json() as Promise<CalendarEvent>;
  }
  if (!response.ok) throw new Error(`Google event error: ${response.status} ${await response.text()}`);
  let event = await response.json() as CalendarEvent;
  for (let attempt = 0; input.mode === "online" && attempt < 3 && !getMeetUrl(event); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const refreshed = await fetch(`${endpoint}/${eventId}?conferenceDataVersion=1`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (refreshed.ok) event = await refreshed.json() as CalendarEvent;
  }
  return event;
}

export async function getMeetingEvent(env: CalendarEnv, accessToken: string, token: string) {
  const calendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
  const eventId = `a${token}`;
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?conferenceDataVersion=1`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Google event lookup error: ${response.status}`);
  return response.json() as Promise<CalendarEvent>;
}

export function getMeetUrl(event: CalendarEvent) {
  return event.hangoutLink ?? event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;
}
