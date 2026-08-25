export const CONTACT_GUIDE_TTL_SECONDS = 60 * 60 * 24 * 30;
export const contactGuideKey = (token: string) => `contact-guide:${token}`;

export type ContactGuideDraft = {
  customerName: string;
  customerEmail: string;
  company: string;
  service: string;
  hearingUrl: string;
  candidates: string[];
  createdAt: string;
  status: "pending" | "sent";
  sentAt?: string;
};
