import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFPage, PDFFont, rgb } from "pdf-lib";
import notoSansJp from "./assets/noto-sans-jp.ttf?inline";

const A4: [number, number] = [595.28, 841.89];
const C = {
  ink: rgb(0.055, 0.20, 0.17),
  green: rgb(0.03, 0.36, 0.25),
  mint: rgb(0.91, 0.96, 0.93),
  orange: rgb(0.80, 0.20, 0.05),
  line: rgb(0.78, 0.84, 0.80),
  soft: rgb(0.96, 0.97, 0.96),
  muted: rgb(0.34, 0.42, 0.38),
  white: rgb(1, 1, 1),
};

const s = (value: unknown) => String(value ?? "").trim();
const list = (value: unknown) => Array.isArray(value) ? value.map(s).filter(Boolean) : [];
const array = <T = any>(value: unknown): T[] => Array.isArray(value) ? value : [];
const short = (value: unknown, max = 100) => {
  const text = s(value).replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
const hex = (value: unknown, fallback: string) => /^#[0-9a-f]{6}$/i.test(s(value)) ? s(value) : fallback;
const hexRgb = (value: string) => rgb(parseInt(value.slice(1, 3), 16) / 255, parseInt(value.slice(3, 5), 16) / 255, parseInt(value.slice(5, 7), 16) / 255);

type DrawCtx = { page: PDFPage; font: PDFFont; pageNo: number; total: number };

function wrap(font: PDFFont, value: unknown, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of s(value).split(/\n/)) {
    let line = "";
    for (const ch of Array.from(paragraph)) {
      const next = line + ch;
      if (line && font.widthOfTextAtSize(next, size) > width) {
        lines.push(line);
        line = ch;
      } else line = next;
    }
    lines.push(line);
  }
  return lines;
}

function text(ctx: DrawCtx, value: unknown, x: number, y: number, opts: { size?: number; width?: number; color?: ReturnType<typeof rgb>; line?: number; maxLines?: number } = {}) {
  const size = opts.size ?? 10;
  const width = opts.width ?? 500;
  const line = opts.line ?? size * 1.55;
  const maxLines = opts.maxLines ?? 99;
  let lines = wrap(ctx.font, value, size, width);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last && ctx.font.widthOfTextAtSize(`${last}…`, size) > width) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}…`;
  }
  lines.forEach((lineText, i) => ctx.page.drawText(lineText, { x, y: y - i * line, size, font: ctx.font, color: opts.color ?? C.ink }));
  return y - lines.length * line;
}

function header(ctx: DrawCtx, section: string, title: string, lead = "") {
  ctx.page.drawText("WANI SAN WEB", { x: 34, y: 807, size: 7.5, font: ctx.font, color: C.muted });
  ctx.page.drawText(String(ctx.pageNo).padStart(2, "0"), { x: 530, y: 807, size: 8, font: ctx.font, color: C.orange });
  ctx.page.drawText(section.toUpperCase(), { x: 34, y: 775, size: 8, font: ctx.font, color: C.green });
  text(ctx, title, 34, 742, { size: 25, width: 525, line: 31, maxLines: 2 });
  if (lead) text(ctx, lead, 34, 690, { size: 9, width: 525, color: C.muted, maxLines: 2 });
}

function footer(ctx: DrawCtx) {
  ctx.page.drawLine({ start: { x: 34, y: 31 }, end: { x: 560, y: 31 }, thickness: 0.5, color: C.line });
  ctx.page.drawText("CONFIDENTIAL / GENERATED FROM HEARING RESPONSE", { x: 34, y: 17, size: 6, font: ctx.font, color: C.muted });
  ctx.page.drawText(`${ctx.pageNo} / ${ctx.total}`, { x: 522, y: 17, size: 6, font: ctx.font, color: C.muted });
}

function box(ctx: DrawCtx, x: number, y: number, w: number, h: number, fill = C.white, border = C.line) {
  ctx.page.drawRectangle({ x, y: y - h, width: w, height: h, color: fill, borderColor: border, borderWidth: 0.7 });
}

function labelValue(ctx: DrawCtx, label: string, value: unknown, x: number, y: number, w: number, h = 72) {
  box(ctx, x, y, w, h, C.soft);
  text(ctx, label, x + 12, y - 17, { size: 7, width: w - 24, color: C.green, maxLines: 1 });
  text(ctx, short(value || "未入力", 75), x + 12, y - 38, { size: 10, width: w - 24, line: 15, maxLines: 2 });
}

function addPage(doc: PDFDocument, font: PDFFont, pageNo: number, total: number) {
  return { page: doc.addPage(A4), font, pageNo, total } satisfies DrawCtx;
}

function drawLogo(ctx: DrawCtx, x: number, y: number, scale = 0.22) {
  ctx.page.drawSvgPath("M18 36c0-8 6-14 14-14h55L116 4c5-3 10-4 16-4h18c8 0 14 4 18 11l20 35 18-20c5-6 11-9 18-9 9 0 16 5 19 13 3 7 1 15-4 21l-28 35c-5 7-12 10-21 10h-10c-9 0-16-4-20-12l-15-25-16 27c-5 8-12 12-21 12h-9c-8 0-15-3-20-9L62 72H32c-8 0-14-6-14-14V36Z", { x, y, scale, color: C.green });
  ctx.page.drawText("WANI SAN WEB", { x: x + 58, y: y + 7, size: 10, font: ctx.font, color: C.ink });
}

function drawCover(ctx: DrawCtx, proposal: any, hearing: any) {
  ctx.page.drawRectangle({ x: 0, y: 0, width: A4[0], height: A4[1], color: C.white });
  ctx.page.drawText("AUTOMATIC PROPOSAL", { x: 42, y: 780, size: 8, font: ctx.font, color: C.orange });
  text(ctx, "Webサイト制作\nご提案書", 42, 610, { size: 38, width: 500, line: 54, maxLines: 2 });
  text(ctx, `${s(hearing.company) || "ご依頼者"} 様`, 44, 475, { size: 17, width: 500, maxLines: 2 });
  text(ctx, short(proposal.concept || "ヒアリング内容をもとに、サイト方針・情報設計・ページラフをご提案します。", 120), 44, 418, { size: 10, width: 450, color: C.muted, line: 17, maxLines: 3 });
  drawLogo(ctx, 42, 72, 0.19);
}

function drawAgenda(ctx: DrawCtx, roughCount: number) {
  header(ctx, "AGENDA", "アジェンダ", "ヒアリング内容から制作着手まで、設計の流れに沿って構成しています。");
  const roughStart = 6;
  const roughEnd = roughStart + roughCount - 1;
  const rows = [
    ["01", "ヒアリング内容の整理", "ご回答内容と制作条件を整理", "03"],
    ["02", "サイト方針", "目的・ターゲット・訴求優先度", "04"],
    ["03", "サイトマップ", "必要ページと情報の関係", "05"],
    ["04", "ページラフ案", "各ページの役割・目的・流れと具体表現", `${String(roughStart).padStart(2, "0")}-${String(roughEnd).padStart(2, "0")}`],
    ["05", "機能", "標準・オプション機能とレスポンシブ", `${String(roughEnd + 1).padStart(2, "0")}-${String(roughEnd + 2).padStart(2, "0")}`],
    ["06", "デザイン方向性", "情報量・動き・カラーの方向性", String(roughEnd + 3).padStart(2, "0")],
    ["07", "今後の流れ", "ご発注から公開・運用まで", String(roughEnd + 4).padStart(2, "0")],
    ["08", "直近のタスク", "ご発注・連絡手段・初回MTG", String(roughEnd + 5).padStart(2, "0")],
  ];
  rows.forEach((row, i) => {
    const y = 637 - i * 69;
    ctx.page.drawLine({ start: { x: 34, y: y - 18 }, end: { x: 560, y: y - 18 }, thickness: 0.5, color: C.line });
    ctx.page.drawText(row[0], { x: 36, y, size: 8, font: ctx.font, color: C.orange });
    ctx.page.drawText(row[1], { x: 77, y, size: 12, font: ctx.font, color: C.ink });
    ctx.page.drawText(row[2], { x: 250, y, size: 8, font: ctx.font, color: C.muted });
    ctx.page.drawText(row[3], { x: 522, y, size: 8, font: ctx.font, color: C.green });
  });
  footer(ctx);
}

function drawHearing(ctx: DrawCtx, hearing: any, proposal: any) {
  header(ctx, "HEARING SUMMARY", "ヒアリング内容の整理", "ご回答内容を、サイト設計に必要な情報へ整理しました。");
  const entries = [
    ["ご相談内容", hearing.productionType], ["業種", hearing.industry],
    ["対応エリア", list(hearing.area).join(" / ")], ["公開希望時期", hearing.launch],
    ["主な目的", hearing.primaryGoal], ["主なターゲット", hearing.primaryCustomer],
    ["優先して伝えたいこと", list(hearing.strength).join(" / ")], ["主な導線", proposal.cta],
    ["更新したい情報", list(hearing.operation).join(" / ")], ["希望する印象", list(hearing.impression).join(" / ")],
    ["避けたい印象・色", hearing.avoidColor], ["必要な機能", [...list(hearing.function), ...list(hearing.analytics)].join(" / ")],
  ];
  entries.forEach(([label, value], i) => labelValue(ctx, label, value, 34 + (i % 2) * 267, 640 - Math.floor(i / 2) * 82, 257, 72));
  box(ctx, 34, 146, 524, 78, C.mint, C.green);
  text(ctx, "提案への反映", 47, 126, { size: 8, width: 490, color: C.green, maxLines: 1 });
  text(ctx, short(proposal.concept, 130), 47, 101, { size: 10, width: 490, line: 15, maxLines: 3 });
  footer(ctx);
}

function drawStrategy(ctx: DrawCtx, proposal: any, hearing: any) {
  header(ctx, "SITE STRATEGY", "サイト方針", "誰に、何を、どの順番で伝え、どの行動につなげるかを定義します。");
  box(ctx, 34, 642, 524, 104, C.ink, C.ink);
  text(ctx, "SITE PURPOSE", 49, 617, { size: 7, width: 480, color: C.white, maxLines: 1 });
  text(ctx, short(proposal.concept || hearing.primaryGoal, 120), 49, 584, { size: 15, width: 475, color: C.white, line: 23, maxLines: 3 });
  const target = proposal.targetAnalysis ?? {};
  labelValue(ctx, "想定ターゲット", target.profile || hearing.primaryCustomer, 34, 518, 257, 134);
  box(ctx, 301, 518, 257, 134, C.soft);
  text(ctx, "優先して伝える内容", 313, 498, { size: 7, width: 230, color: C.green, maxLines: 1 });
  (proposal.priorities ?? []).slice(0, 4).forEach((p: any, i: number) => {
    ctx.page.drawCircle({ x: 324, y: 465 - i * 25, size: 9, color: i === 0 ? C.orange : C.green });
    ctx.page.drawText(String(i + 1), { x: 321, y: 462 - i * 25, size: 6, font: ctx.font, color: C.white });
    text(ctx, short(p.title || p.reason, 32), 342, 468 - i * 25, { size: 8.5, width: 195, maxLines: 1 });
  });
  text(ctx, "ユーザー行動の設計", 34, 348, { size: 9, width: 500, color: C.green, maxLines: 1 });
  const flow = (proposal.userFlow ?? []).slice(0, 5);
  flow.forEach((item: any, i: number) => {
    const w = 100;
    const x = 34 + i * 105;
    box(ctx, x, 322, w, 74, i === flow.length - 1 ? C.mint : C.white);
    ctx.page.drawText(String(i + 1).padStart(2, "0"), { x: x + 10, y: 300, size: 7, font: ctx.font, color: C.orange });
    text(ctx, short(item.title, 20), x + 10, 278, { size: 9, width: w - 20, maxLines: 2 });
  });
  box(ctx, 34, 224, 524, 96, C.soft);
  text(ctx, "重要な設計判断", 47, 202, { size: 8, width: 490, color: C.green, maxLines: 1 });
  text(ctx, short((proposal.issues ?? [])[0]?.body || target.behavior, 140), 47, 174, { size: 10, width: 490, line: 16, maxLines: 4 });
  footer(ctx);
}

function drawSitemap(ctx: DrawCtx, proposal: any) {
  header(ctx, "SITE STRUCTURE", "サイトマップ", "各ページの役割を整理し、主要情報へ迷わず移動できる構成にします。");
  const pages = (proposal.sitemap ?? []).slice(0, 12);
  box(ctx, 210, 635, 175, 54, C.ink, C.ink);
  text(ctx, "TOP", 225, 604, { size: 14, width: 145, color: C.white, maxLines: 1 });
  ctx.page.drawLine({ start: { x: 297.5, y: 581 }, end: { x: 297.5, y: 553 }, thickness: 1, color: C.green });
  const children = pages.filter((p: any) => s(p.slug).toLowerCase() !== "top");
  const cols = 3;
  children.forEach((p: any, i: number) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 34 + col * 177;
    const y = 540 - row * 118;
    box(ctx, x, y, 167, 92, C.soft);
    ctx.page.drawText(String(i + 1).padStart(2, "0"), { x: x + 11, y: y - 19, size: 7, font: ctx.font, color: C.orange });
    text(ctx, short(p.label || p.slug, 28), x + 11, y - 40, { size: 11, width: 145, maxLines: 2 });
    text(ctx, short(p.role, 48), x + 11, y - 67, { size: 7, width: 145, color: C.muted, maxLines: 2 });
  });
  footer(ctx);
}

function sectionVisual(ctx: DrawCtx, section: any, x: number, y: number, w: number, h: number, index: number) {
  box(ctx, x, y, w, h, index % 2 ? C.soft : C.white);
  const type = s(section.type).toUpperCase();
  ctx.page.drawText(String(index + 1).padStart(2, "0"), { x: x + 10, y: y - 18, size: 6.5, font: ctx.font, color: C.orange });
  text(ctx, type || "SECTION", x + 34, y - 18, { size: 6.5, width: w - 44, color: C.green, maxLines: 1 });
  text(ctx, short(section.heading || section.title, 44), x + 10, y - 42, { size: 10, width: w * 0.56, line: 14, maxLines: 2 });
  text(ctx, short(section.body || section.content, 75), x + 10, y - 75, { size: 7, width: w * 0.56, line: 11, maxLines: 3, color: C.muted });
  const vx = x + w * 0.62;
  const vw = w * 0.34;
  if (/FORM|CONTACT|問い合わせ/.test(type)) {
    [0, 1, 2].forEach((i) => ctx.page.drawRectangle({ x: vx, y: y - 27 - i * 24, width: vw, height: 16, color: C.white, borderColor: C.line, borderWidth: 0.6 }));
    ctx.page.drawRectangle({ x: vx, y: y - 107, width: vw * 0.62, height: 18, color: C.green });
  } else if (/FAQ|LIST|FLOW|STEP/.test(type)) {
    [0, 1, 2].forEach((i) => {
      ctx.page.drawCircle({ x: vx + 5, y: y - 24 - i * 25, size: 3, color: C.green });
      ctx.page.drawLine({ start: { x: vx + 13, y: y - 24 - i * 25 }, end: { x: vx + vw, y: y - 24 - i * 25 }, thickness: 1.2, color: C.line });
    });
  } else {
    [0, 1, 2].forEach((i) => ctx.page.drawRectangle({ x: vx + i * (vw / 3), y: y - 71, width: vw / 3 - 4, height: 52, color: i === 0 ? C.mint : C.soft, borderColor: C.line, borderWidth: 0.5 }));
  }
  const items = list(section.items).slice(0, 3).join(" / ");
  if (items) text(ctx, short(items, 48), vx, y - h + 15, { size: 6.5, width: vw, color: C.muted, maxLines: 1 });
}

function drawRough(ctx: DrawCtx, pageData: any) {
  header(ctx, "PAGE ROUGH", pageData.title || pageData.slug || "ページラフ", "ページの役割・目的・情報の流れを先に定義し、その下に主要エリアを具体化します。");
  box(ctx, 34, 644, 524, 100, C.mint, C.green);
  const role = pageData.role || "このページで伝える内容を整理します。";
  const purpose = pageData.purpose || pageData.pagePurpose || role;
  const flow = pageData.contentFlow || array(pageData.sections).map((section: any) => section.title || section.heading).filter(Boolean).slice(0, 5).join(" → ");
  text(ctx, "役割", 47, 622, { size: 7, width: 60, color: C.green, maxLines: 1 });
  text(ctx, short(role, 62), 95, 622, { size: 8.5, width: 445, maxLines: 2 });
  text(ctx, "目的", 47, 586, { size: 7, width: 60, color: C.green, maxLines: 1 });
  text(ctx, short(purpose, 62), 95, 586, { size: 8.5, width: 445, maxLines: 2 });
  text(ctx, "流れ", 47, 550, { size: 7, width: 60, color: C.green, maxLines: 1 });
  text(ctx, short(flow, 75), 95, 550, { size: 8.5, width: 445, maxLines: 2 });
  const sections = array(pageData.sections);
  const shown = sections.slice(0, 4);
  const h = 108;
  shown.forEach((section: any, i: number) => sectionVisual(ctx, section, 34, 520 - i * (h + 9), 524, h, i));
  if (sections.length > shown.length) text(ctx, `※ この下に詳細エリアが続きます（全${sections.length}エリア）`, 34, 64, { size: 7, width: 524, color: C.muted, maxLines: 1 });
  footer(ctx);
}

function drawFeatures(ctx: DrawCtx, hearing: any) {
  header(ctx, "FUNCTIONS", "機能", "制作時に共通で整える標準機能と、要件に応じて追加するオプション機能を分けて整理します。");
  const standard = [
    ["レスポンシブ", "PC・タブレット・スマートフォンに最適化"],
    ["SEO基本設定", "タイトル・説明文・構造化・検索導線の基礎"],
    ["アクセシビリティ基本対応", "読みやすさ・操作性・代替情報を配慮"],
    ["パフォーマンス最適化", "画像・コード・表示速度を基本調整"],
    ["CDN・WAF", "配信高速化と基本的なWeb防御"],
  ];
  const optional = [
    ["お問い合わせフォーム", "入力・確認・送信・完了までを設計"],
    ["メール配信", "通知・自動返信・各種配信を要件化"],
    ["アクセス解析", "利用目的に応じて計測環境を設定"],
  ];
  text(ctx, "標準機能", 34, 640, { size: 14, width: 250, maxLines: 1 });
  standard.forEach(([title, body], i) => labelValue(ctx, title, body, 34 + (i % 2) * 267, 610 - Math.floor(i / 2) * 83, 257, 72));
  text(ctx, "オプション機能", 34, 343, { size: 14, width: 250, maxLines: 1 });
  optional.forEach(([title, body], i) => labelValue(ctx, title, body, 34 + (i % 2) * 267, 313 - Math.floor(i / 2) * 83, 257, 72));
  const requested = [...list(hearing.function), ...list(hearing.analytics)].join(" / ") || "ヒアリング内容をもとに打ち合わせで確定";
  box(ctx, 34, 142, 524, 70, C.mint, C.green);
  text(ctx, "今回の候補", 47, 120, { size: 7, width: 100, color: C.green, maxLines: 1 });
  text(ctx, short(requested, 120), 47, 96, { size: 9, width: 490, line: 14, maxLines: 3 });
  footer(ctx);
}

function drawResponsive(ctx: DrawCtx) {
  header(ctx, "RESPONSIVE", "レスポンシブ設計", "基本ブレイクポイントを768pxに設定し、タブレット幅からレイアウトを切り替えます。");
  ctx.page.drawLine({ start: { x: 80, y: 600 }, end: { x: 520, y: 600 }, thickness: 2, color: C.line });
  ctx.page.drawCircle({ x: 337, y: 600, size: 8, color: C.orange });
  text(ctx, "768px", 320, 575, { size: 9, width: 60, color: C.orange, maxLines: 1 });
  text(ctx, "スマートフォン", 80, 623, { size: 9, width: 150, color: C.green, maxLines: 1 });
  text(ctx, "タブレット・PC", 420, 623, { size: 9, width: 110, color: C.green, maxLines: 1 });
  box(ctx, 50, 535, 170, 335, C.soft);
  box(ctx, 248, 535, 310, 335, C.soft);
  [0, 1, 2, 3].forEach((i) => box(ctx, 63, 505 - i * 68, 144, 56, i === 0 ? C.mint : C.white));
  [0, 1].forEach((row) => [0, 1, 2].forEach((col) => box(ctx, 263 + col * 94, 505 - row * 112, 82, 98, row === 0 && col === 0 ? C.mint : C.white)));
  text(ctx, "1カラム", 98, 176, { size: 11, width: 90, maxLines: 1 });
  text(ctx, "内容の優先順位に沿って縦に再配置", 63, 154, { size: 7, width: 144, color: C.muted, maxLines: 2 });
  text(ctx, "2〜3カラム", 357, 176, { size: 11, width: 100, maxLines: 1 });
  text(ctx, "画面幅を活かして比較・一覧性を確保", 303, 154, { size: 7, width: 210, color: C.muted, maxLines: 2 });
  footer(ctx);
}

function drawAxis(ctx: DrawCtx, title: string, left: string, right: string, rank: number, y: number) {
  text(ctx, title, 34, y + 34, { size: 9, width: 250, color: C.green, maxLines: 1 });
  text(ctx, left, 34, y + 9, { size: 8, width: 130, maxLines: 1 });
  text(ctx, right, 458, y + 9, { size: 8, width: 100, maxLines: 1 });
  ctx.page.drawLine({ start: { x: 140, y }, end: { x: 455, y }, thickness: 2, color: C.line });
  for (let i = 1; i <= 5; i++) {
    const x = 140 + (i - 1) * 78.75;
    ctx.page.drawCircle({ x, y, size: i === rank ? 9 : 4, color: i === rank ? C.orange : C.line });
    ctx.page.drawText(String(i), { x: x - 2, y: y - 2.5, size: 5, font: ctx.font, color: i === rank ? C.white : C.muted });
  }
}

function drawDesign(ctx: DrawCtx, proposal: any, hearing: any) {
  header(ctx, "DESIGN DIRECTION", "デザイン方向性", "2つの軸を5段階の位置で示し、色と表現の方向性を具体化します。");
  const design = proposal.designDirection ?? {};
  const infoRank = Math.min(5, Math.max(1, Number(design.informationRank) || 3));
  const motionRank = Math.min(5, Math.max(1, Number(design.motionRank) || 2));
  drawAxis(ctx, "情報の見せ方", "情報量・説明重視", "視覚・印象重視", infoRank, 595);
  drawAxis(ctx, "動きの見せ方", "シンプル・静的", "アクティブ・動的", motionRank, 505);
  text(ctx, "カラーパレット", 34, 434, { size: 11, width: 200, maxLines: 1 });
  const palette = Array.isArray(design.palette) ? design.palette : [];
  const colors = [hex(palette[0], "#0D473A"), hex(palette[1], "#177B63"), hex(palette[2], "#EAF4EF"), hex(palette[3], "#D84A1B"), hex(palette[4], "#F5F6F3")];
  colors.forEach((color, i) => {
    ctx.page.drawRectangle({ x: 34 + i * 105, y: 340, width: 94, height: 68, color: hexRgb(color), borderColor: C.line, borderWidth: 0.5 });
    ctx.page.drawText(color.toUpperCase(), { x: 49 + i * 105, y: 326, size: 6.5, font: ctx.font, color: C.muted });
  });
  labelValue(ctx, "トーン", design.tone || list(hearing.impression).join(" / "), 34, 286, 257, 98);
  labelValue(ctx, "ビジュアル表現", design.visual, 301, 286, 257, 98);
  box(ctx, 34, 168, 524, 84, C.mint, C.green);
  text(ctx, "参考・留意点", 47, 146, { size: 7, width: 100, color: C.green, maxLines: 1 });
  text(ctx, short(design.referenceReflection || design.note || hearing.designReference, 150), 47, 120, { size: 9, width: 490, line: 14, maxLines: 4 });
  footer(ctx);
}

function drawProcess(ctx: DrawCtx) {
  header(ctx, "NEXT PROCESS", "今後の流れ", "ご発注後、構成・デザイン・実装・公開へ順番に進めます。工程は番号と位置で示します。");
  const steps = [
    ["ご発注のお手続き", "発注内容・条件を確認し、制作を開始します。"],
    ["構成・仕様の確定", "ページ構成、機能、デザイン方針を確定します。"],
    ["原稿・素材の準備", "掲載原稿、写真、料金、実績などをご用意いただきます。"],
    ["デザイン制作", "主要ページから制作し、方向性をご確認いただきます。"],
    ["環境準備", "ドメイン・サーバー・利用サービスを準備します。"],
    ["実装・機能開発", "確定デザインをもとに画面と機能を実装します。"],
    ["検証・最終確認", "表示、操作、文章、各種設定を確認・調整します。"],
    ["公開・運用開始", "本番公開後、必要に応じて保守・改善を継続します。"],
  ];
  ctx.page.drawLine({ start: { x: 74, y: 626 }, end: { x: 74, y: 96 }, thickness: 2, color: C.line });
  steps.forEach(([title, body], i) => {
    const y = 630 - i * 73;
    ctx.page.drawCircle({ x: 74, y: y - 19, size: 15, color: i === 0 ? C.orange : C.green });
    ctx.page.drawText(String(i + 1).padStart(2, "0"), { x: 67, y: y - 22, size: 6.5, font: ctx.font, color: C.white });
    box(ctx, 105, y, 453, 57, i === 0 ? C.mint : C.soft);
    text(ctx, title, 119, y - 19, { size: 10, width: 180, maxLines: 1 });
    text(ctx, body, 303, y - 18, { size: 7.5, width: 240, line: 11, maxLines: 2, color: C.muted });
  });
  footer(ctx);
}

function drawTasks(ctx: DrawCtx, hearing: any) {
  header(ctx, "IMMEDIATE TASKS", "直近のタスク", "制作開始に向けて、まず次の3点を順番に進めます。");
  const tasks = [
    ["01", "ご発注のお手続き", "提案内容・条件をご確認いただき、発注手続きをお願いします。"],
    ["02", "コミュニケーションツールの確認", "日常連絡・資料共有に使用するツールと参加メンバーを決めます。"],
    ["03", "方針FB・デザイン案確認・利用サービス案内（MTG）", "本提案へのフィードバックを受け、デザイン案と利用サービスをご案内します。"],
  ];
  tasks.forEach(([no, title, body], i) => {
    const y = 625 - i * 164;
    box(ctx, 34, y, 524, 137, i === 0 ? C.mint : C.soft, i === 0 ? C.green : C.line);
    ctx.page.drawCircle({ x: 66, y: y - 34, size: 18, color: i === 0 ? C.orange : C.green });
    ctx.page.drawText(no, { x: 59, y: y - 37, size: 7, font: ctx.font, color: C.white });
    text(ctx, title, 99, y - 31, { size: 13, width: 425, line: 19, maxLines: 2 });
    text(ctx, body, 99, y - 78, { size: 9, width: 425, line: 15, maxLines: 3, color: C.muted });
  });
  box(ctx, 34, 116, 524, 54, C.ink, C.ink);
  text(ctx, `${s(hearing.company) || "ご依頼者"} 様との初回MTGで、制作条件を確定します。`, 48, 88, { size: 9, width: 490, color: C.white, maxLines: 2 });
  footer(ctx);
}

export async function generateProposalPdf(proposal: any, hearing: any) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const encodedFont = notoSansJp.slice(notoSansJp.indexOf(",") + 1);
  const fontBytes = Uint8Array.from(atob(encodedFont), (character) => character.charCodeAt(0));
  const font = await doc.embedFont(fontBytes, { subset: true });
  const roughPages = Array.isArray(proposal.roughPages) && proposal.roughPages.length ? proposal.roughPages : [{ slug: "top", title: "TOP", role: "サイト全体の入口", sections: [] }];
  const total = 10 + roughPages.length;
  doc.setTitle(`${s(hearing.company) || "Webサイト"} Webサイト制作ご提案書`);
  doc.setAuthor("WANI SAN WEB");
  doc.setSubject("ヒアリング回答をもとに自動生成したWebサイト制作提案書");
  let no = 1;
  drawCover(addPage(doc, font, no++, total), proposal, hearing);
  drawAgenda(addPage(doc, font, no++, total), roughPages.length);
  drawHearing(addPage(doc, font, no++, total), hearing, proposal);
  drawStrategy(addPage(doc, font, no++, total), proposal, hearing);
  drawSitemap(addPage(doc, font, no++, total), proposal);
  roughPages.forEach((page: any) => drawRough(addPage(doc, font, no++, total), page));
  drawFeatures(addPage(doc, font, no++, total), hearing);
  drawResponsive(addPage(doc, font, no++, total));
  drawDesign(addPage(doc, font, no++, total), proposal, hearing);
  drawProcess(addPage(doc, font, no++, total));
  drawTasks(addPage(doc, font, no++, total), hearing);
  return doc.save();
}
