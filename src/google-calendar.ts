export type CalendarEnv = {
  GOOGLE_CALENDAR_CLIENT_ID: string;
  GOOGLE_CALENDAR_CLIENT_SECRET: string;
  GOOGLE_CALENDAR_REFRESH_TOKEN: string;
  GOOGLE_CALENDAR_ID: string;
};

type TokenResult = { access_token?: string };
type FreeBusyResult = { calendars?: Record<string, { busy?: { start: string; end: string }[] }> };
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

export async function isCalendarSlotFree(env: CalendarEnv, accessToken: string, start: Date, end: Date) {
  const calendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: "Asia/Tokyo", items: [{ id: calendarId }] }),
  });
  if (!response.ok) throw new Error(`Google freeBusy error: ${response.status}`);
  const result = await response.json() as FreeBusyResult;
  return (result.calendars?.[calendarId]?.busy ?? []).length === 0;
}

export async function createMeetingEvent(env: CalendarEnv, accessToken: string, input: { token: string; customerName: string; customerEmail: string; company: string; start: Date; end: Date }) {
  const calendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
  const eventId = `a${input.token}`;
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const response = await fetch(`${endpoint}?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      id: eventId,
      summary: `Wani san Web 初回お打ち合わせ｜${input.company || `${input.customerName}様`}`,
      description: "Webサイト制作に関する初回お打ち合わせ",
      start: { dateTime: input.start.toISOString(), timeZone: "Asia/Tokyo" },
      end: { dateTime: input.end.toISOString(), timeZone: "Asia/Tokyo" },
      attendees: [{ email: input.customerEmail }],
      conferenceData: { createRequest: { requestId: `meet-${input.token}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    }),
  });
  if (response.status === 409) {
    const existing = await fetch(`${endpoint}/${eventId}?conferenceDataVersion=1`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!existing.ok) throw new Error(`Google existing event error: ${existing.status}`);
    return existing.json() as Promise<CalendarEvent>;
  }
  if (!response.ok) throw new Error(`Google event error: ${response.status} ${await response.text()}`);
  let event = await response.json() as CalendarEvent;
  for (let attempt = 0; attempt < 3 && !getMeetUrl(event); attempt += 1) {
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
