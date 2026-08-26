export const CONTACT_GUIDE_TTL_SECONDS = 60 * 60 * 24 * 30;
export const contactGuideKey = (token: string) => `contact-guide:${token}`;

export type ContactGuideDraft = {
  customerName: string;
  customerEmail: string;
  company: string;
  service: string;
  hearingUrl: string;
  candidates: string[];
  candidateSlots?: { label: string; start: string }[];
  createdAt: string;
  status: "pending" | "sent" | "needs-review" | "booked";
  sentAt?: string;
  bookedAt?: string;
  bookedStart?: string;
  calendarEventId?: string;
  meetUrl?: string;
};
