export type ProposalAdminEnv = {
  PROPOSALS?: R2Bucket;
  ADMIN_STATUS_PASSWORD?: string;
};

export function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="WSW Proposal Status"' },
  });
}

export function authenticated(request: Request, env: ProposalAdminEnv) {
  const password = env.ADMIN_STATUS_PASSWORD;
  if (!password) return false;
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    return decoded.slice(0, separator) === "admin" && decoded.slice(separator + 1) === password;
  } catch {
    return false;
  }
}

export function validAccessId(value: unknown) {
  const accessId = String(value ?? "");
  return /^H-[A-Z0-9-]{20,80}$/i.test(accessId) ? accessId : "";
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function readJson<T = any>(bucket: R2Bucket, key: string): Promise<T | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  try { return await object.json<T>(); } catch { return null; }
}

export async function writeJson(bucket: R2Bucket, key: string, value: unknown) {
  await bucket.put(key, JSON.stringify(value, null, 2), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  });
}

export async function updateProposalStatus(bucket: R2Bucket, accessId: string, patch: Record<string, unknown>) {
  const key = `proposals/${accessId}/status.json`;
  const current = await readJson<Record<string, unknown>>(bucket, key) ?? {};
  await writeJson(bucket, key, { ...current, ...patch, updatedAt: new Date().toISOString() });
}

export function safeError(error: unknown) {
  return (error instanceof Error ? error.message : String(error))
    .replace(/Bearer\s+[^\s"']+/gi, "Bearer [REDACTED]")
    .replace(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g, "[REDACTED]")
    .slice(0, 1500);
}

