type GoogleSlidesEnv = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?: string;
  GOOGLE_IMPERSONATED_USER?: string;
  GOOGLE_DRIVE_FOLDER_ID?: string;
  GOOGLE_SLIDES_TEMPLATE_ID?: string;
};

export type ProposalSlidesRecord = {
  presentationId: string;
  editUrl: string;
  createdAt: string;
  updatedAt: string;
  status: "editing" | "pdf_ready" | "sent";
  exportedAt?: string;
  sentAt?: string;
  recipient?: string;
};

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";
const SLIDES_SCOPE = "https://www.googleapis.com/auth/presentations";

const encode = (input: string | Uint8Array) => {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

function configured(value?: string) {
  return Boolean(value && !value.startsWith("SET_IN_"));
}

export function googleSlidesConfigured(env: GoogleSlidesEnv) {
  return configured(env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
    && configured(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
    && configured(env.GOOGLE_DRIVE_FOLDER_ID)
    && configured(env.GOOGLE_SLIDES_TEMPLATE_ID);
}

async function accessToken(env: GoogleSlidesEnv) {
  if (!googleSlidesConfigured(env)) throw new Error("Googleスライド連携が未設定です。");
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = encode(JSON.stringify({
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: `${DRIVE_SCOPE} ${SLIDES_SCOPE}`,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    ...(configured(env.GOOGLE_IMPERSONATED_USER) ? { sub: env.GOOGLE_IMPERSONATED_USER } : {}),
  }));
  const pem = String(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).replace(/\\n/g, "\n");
  const der = Uint8Array.from(atob(pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "")), (character) => character.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claims}`));
  const assertion = `${header}.${claims}.${encode(new Uint8Array(signature))}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error(`Google認証に失敗しました (${response.status}): ${await response.text()}`);
  const data = await response.json<{ access_token?: string }>();
  if (!data.access_token) throw new Error("Google認証トークンを取得できませんでした。");
  return data.access_token;
}

async function googleFetch<T>(token: string, url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${token}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(url, { ...init, headers });
  if (!response.ok) throw new Error(`Google API ${response.status}: ${await response.text()}`);
  return response.json<T>();
}

const compact = (value: unknown, limit = 180) => {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized;
};

const list = (value: unknown, limit = 5) => Array.isArray(value)
  ? value.slice(0, limit).map((item) => compact(typeof item === "string" ? item : item?.title || item?.label || item?.name || item, 48)).filter(Boolean).join("\n")
  : compact(value);

function replacements(proposal: any, hearing: any, hearingId: string) {
  const design = proposal?.designDirection ?? {};
  const standard = [
    "レスポンシブ対応（768pxを基準）",
    "SEO基本設定（アクセシビリティ・パフォーマンスを含む）",
    "CDN・WAF",
  ];
  const optional = ["お問い合わせフォーム", "メール配信", "アクセス解析"];
  const sitemap = Array.isArray(proposal?.sitemap) ? proposal.sitemap : [];
  return {
    "{{HEARING_ID}}": compact(hearingId, 40),
    "{{COMPANY}}": compact(hearing?.company, 60),
    "{{PROPOSAL_TITLE}}": compact(proposal?.title || `${hearing?.company || ""} Webサイト制作提案`, 40),
    "{{CONCEPT}}": compact(proposal?.concept, 90),
    "{{INDUSTRY}}": compact(hearing?.industry, 60),
    "{{BUSINESS}}": compact(hearing?.business, 100),
    "{{TARGET}}": compact(hearing?.primaryCustomer, 70),
    "{{GOAL}}": compact(hearing?.primaryGoal, 70),
    "{{STRENGTHS}}": list(hearing?.strength, 4),
    "{{ISSUES}}": list(proposal?.issues, 3),
    "{{PRIORITIES}}": list(proposal?.priorities, 4),
    "{{USER_FLOW}}": list(proposal?.userFlow, 5),
    "{{SITEMAP_MAIN}}": sitemap.filter((page: any) => page?.pageType !== "utility").map((page: any, index: number) => `${String(index + 1).padStart(2, "0")}  ${compact(page?.label || page?.slug, 30)}`).join("\n"),
    "{{SITEMAP_UTILITY}}": sitemap.filter((page: any) => page?.pageType === "utility").map((page: any) => compact(page?.label || page?.slug, 30)).join(" / "),
    "{{STANDARD_FUNCTIONS}}": standard.join("\n"),
    "{{OPTION_FUNCTIONS}}": optional.join("\n"),
    "{{DESIGN_TONE}}": compact(design?.tone, 100),
    "{{DESIGN_INFO_RANK}}": compact(design?.informationRank || 3, 4),
    "{{DESIGN_MOTION_RANK}}": compact(design?.motionRank || 2, 4),
    "{{DESIGN_PALETTE}}": Array.isArray(design?.palette) ? design.palette.join(" / ") : "",
    "{{NEXT_PROCESS}}": "01 ご発注のお手続き\n02 構成・仕様の確定\n03 原稿・素材の準備\n04 デザイン制作\n05 環境準備\n06 実装・機能開発\n07 検証・最終確認\n08 公開・運用開始",
  };
}

function roughReplacements(page: any) {
  const result: Record<string, string> = {
    "{{ROUGH_PAGE_TITLE}}": compact(page?.title || page?.slug, 50),
    "{{ROUGH_PAGE_ROLE}}": compact(page?.role, 64),
    "{{ROUGH_PAGE_PURPOSE}}": compact(page?.purpose, 64),
    "{{ROUGH_PAGE_FLOW}}": compact(page?.contentFlow, 80),
  };
  const sections = Array.isArray(page?.sections) ? page.sections.slice(0, 6) : [];
  for (let index = 0; index < 6; index += 1) {
    const section = sections[index] ?? {};
    const number = index + 1;
    result[`{{AREA_${number}_TITLE}}`] = compact(section?.heading || section?.title || "", 32);
    result[`{{AREA_${number}_TYPE}}`] = compact(section?.type || "", 20);
    result[`{{AREA_${number}_PATTERN}}`] = patternLabel(section?.type);
    result[`{{AREA_${number}_CONTENT}}`] = compact(section?.content || section?.body || list(section?.items, 3), 70);
    result[`{{AREA_${number}_INTENT}}`] = compact(section?.purpose, 45);
  }
  return result;
}

function patternLabel(value: unknown) {
  const type = String(value ?? "").toUpperCase();
  if (type === "HERO") return "見出し ｜ KEY VISUAL";
  if (type === "3-COLUMN") return "□  □  □";
  if (type === "CARD-GRID") return "▦  ▦  ▦";
  if (type === "LIST") return "☰  LIST";
  if (type === "COMPARISON") return "□  ⇄  □";
  if (type === "STEP-FLOW") return "① → ② → ③";
  if (type === "FAQ") return "Q ＋ / A";
  if (type === "CTA") return "［  CTA  ］";
  if (type === "FORM") return "□  □  FORM";
  if (type === "PROFILE") return "○ ＋ PROFILE";
  if (type === "GALLERY") return "▦  GALLERY";
  if (type === "ACCESS") return "MAP ＋ GUIDE";
  return "見出し ＋ 本文";
}

function replaceRequests(values: Record<string, string>, pageObjectIds?: string[]) {
  return Object.entries(values).map(([tag, value]) => ({
    replaceAllText: {
      containsText: { text: tag, matchCase: true },
      replaceText: value || "—",
      ...(pageObjectIds ? { pageObjectIds } : {}),
    },
  }));
}

function slideText(slide: any) {
  return (slide?.pageElements ?? []).flatMap((element: any) => element?.shape?.text?.textElements ?? [])
    .map((element: any) => element?.textRun?.content ?? "").join("");
}

export async function createProposalSlides(env: GoogleSlidesEnv, proposal: any, hearing: any, hearingId: string): Promise<ProposalSlidesRecord> {
  const token = await accessToken(env);
  const copied = await googleFetch<{ id: string; webViewLink?: string }>(
    token,
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(String(env.GOOGLE_SLIDES_TEMPLATE_ID))}/copy?supportsAllDrives=true&fields=id,webViewLink`,
    {
      method: "POST",
      body: JSON.stringify({
        name: `【編集用】${compact(hearing?.company, 60)} Webサイト制作提案_${hearingId}`,
        parents: [env.GOOGLE_DRIVE_FOLDER_ID],
      }),
    },
  );
  const presentation = await googleFetch<any>(token, `https://slides.googleapis.com/v1/presentations/${copied.id}`);
  const roughTemplate = (presentation.slides ?? []).find((slide: any) => slideText(slide).includes("{{ROUGH_PAGE_TITLE}}"));
  if (!roughTemplate) throw new Error("Googleスライドテンプレートに{{ROUGH_PAGE_TITLE}}を含むページラフ用スライドがありません。");

  const pages = Array.isArray(proposal?.roughPages) ? proposal.roughPages : [];
  const roughIds = pages.map((_: any, index: number) => `rough_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}_${index}`);
  const structuralRequests = [
    ...roughIds.map((objectId: string) => ({ duplicateObject: { objectId: roughTemplate.objectId, objectIds: { [roughTemplate.objectId]: objectId } } })),
    ...(roughIds.length ? [{ updateSlidesPosition: { slideObjectIds: roughIds, insertionIndex: 5 } }] : []),
    { deleteObject: { objectId: roughTemplate.objectId } },
  ];
  const requests = [
    ...structuralRequests,
    ...replaceRequests(replacements(proposal, hearing, hearingId)),
    ...pages.flatMap((page: any, index: number) => replaceRequests(roughReplacements(page), [roughIds[index]])),
  ];
  await googleFetch(token, `https://slides.googleapis.com/v1/presentations/${copied.id}:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({ requests }),
  });
  const now = new Date().toISOString();
  return {
    presentationId: copied.id,
    editUrl: copied.webViewLink || `https://docs.google.com/presentation/d/${copied.id}/edit`,
    createdAt: now,
    updatedAt: now,
    status: "editing",
  };
}

export async function exportProposalSlidesPdf(env: GoogleSlidesEnv, presentationId: string) {
  const token = await accessToken(env);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(presentationId)}/export?mimeType=${encodeURIComponent("application/pdf")}`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (!response.ok) throw new Error(`GoogleスライドのPDF書き出しに失敗しました (${response.status}): ${await response.text()}`);
  return response.arrayBuffer();
}
