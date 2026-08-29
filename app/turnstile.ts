// Turnstile site keys are public identifiers. Allow environment overrides while
// keeping production builds functional when no local .env file is present.
export const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAEQ36yoZAjfcBmXh";
