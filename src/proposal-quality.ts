import { blueprintSummary, classifyPage, PAGE_BLUEPRINTS, type BlueprintKey } from "./proposal-blueprints";

const text = (value: unknown) => String(value ?? "").trim();
const array = <T = any>(value: unknown): T[] => Array.isArray(value) ? value : [];

const utilityPattern = /privacy|policy|terms|legal|プライバシー|個人情報|利用規約/i;
const contactPattern = /contact|inquiry|otoiawase|お問い合わせ|お問合せ|ご相談/i;
const allowedTypes = [
  "HERO", "LEAD", "3-COLUMN", "CARD-GRID", "LIST", "COMPARISON",
  "STEP-FLOW", "FAQ", "CTA", "FORM", "PROFILE", "GALLERY", "ACCESS",
];

export function prepareProposal(value: any) {
  const proposal = value && typeof value === "object" ? value : {};
  proposal.sitemap = array(proposal.sitemap).map((page: any) => {
    const key = `${text(page?.slug)} ${text(page?.label)}`;
    const normalized = { ...page, pageType: page?.pageType === "utility" || utilityPattern.test(key) ? "utility" : "main" };
    return { ...normalized, templateKey: classifyPage(normalized) };
  });
  const sitemapBySlug = new Map(proposal.sitemap.map((page: any) => [text(page.slug), page]));
  proposal.roughPages = array(proposal.roughPages).map((page: any) => {
    const sitemapPage: any = sitemapBySlug.get(text(page?.slug));
    const pageType = sitemapPage?.pageType || (utilityPattern.test(`${text(page?.slug)} ${text(page?.title)}`) ? "utility" : "main");
    const templateKey: BlueprintKey = sitemapPage?.templateKey || classifyPage({ ...page, pageType });
    const sourceSections = array(page?.sections);
    const used = new Set<number>();
    const sections = PAGE_BLUEPRINTS[templateKey].map((slot, slotIndex) => {
      let sourceIndex = sourceSections.findIndex((section: any, index: number) => !used.has(index) && text(section?.type).toUpperCase() === slot.type);
      if (sourceIndex < 0 && slotIndex < sourceSections.length && !used.has(slotIndex)) sourceIndex = slotIndex;
      const source: any = sourceIndex >= 0 ? sourceSections[sourceIndex] : {};
      if (sourceIndex >= 0) used.add(sourceIndex);
      return {
        ...source,
        type: slot.type,
        title: text(source?.title) || slot.heading,
        heading: text(source?.heading) || text(source?.title) || slot.heading,
        purpose: text(source?.purpose) || slot.intent,
        items: array(source?.items),
      };
    });
    return { ...page, pageType, templateKey, sections };
  });
  return proposal;
}

export function validateProposal(proposal: any) {
  const errors: string[] = [];
  const sitemap = array(proposal?.sitemap);
  const roughPages = array(proposal?.roughPages);
  const mainPages = sitemap.filter((page: any) => page.pageType !== "utility");
  const utilityPages = sitemap.filter((page: any) => page.pageType === "utility");
  const sitemapSlugs = sitemap.map((page: any) => text(page?.slug));
  const roughSlugs = roughPages.map((page: any) => text(page?.slug));

  if (!text(proposal?.title) || !text(proposal?.concept) || !text(proposal?.cta)) errors.push("タイトル・コンセプト・CTAをすべて記載する");
  if (mainPages.length < 5 || mainPages.length > 8) errors.push(`主要ページはTOPを含め5〜8ページにする（現在${mainPages.length}ページ）`);
  if (!sitemap.some((page: any) => text(page.slug).toLowerCase() === "top")) errors.push("slug=topのTOPページを含める");
  if (!mainPages.some((page: any) => contactPattern.test(`${text(page.slug)} ${text(page.label)}`))) errors.push("主要ページにお問い合わせページを含める");
  if (!utilityPages.some((page: any) => utilityPattern.test(`${text(page.slug)} ${text(page.label)}`))) errors.push("補助ページとしてプライバシーポリシーを含める");
  if (sitemapSlugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) errors.push("slugは重複のない半角英数字とハイフンだけで作る");
  if (new Set(sitemapSlugs).size !== sitemapSlugs.length) errors.push("sitemapのslugを重複させない");
  if (new Set(roughSlugs).size !== roughSlugs.length) errors.push("roughPagesのslugを重複させない");
  if (sitemapSlugs.length !== roughSlugs.length || sitemapSlugs.some((slug) => !roughSlugs.includes(slug)) || roughSlugs.some((slug) => !sitemapSlugs.includes(slug))) {
    errors.push("sitemapとroughPagesのページを完全一致させる");
  }
  if (array(proposal?.issues).length < 2) errors.push("サイト課題を2件以上記載する");
  if (array(proposal?.priorities).length < 3) errors.push("訴求の優先事項を3件以上記載する");
  if (array(proposal?.userFlow).length < 4) errors.push("閲覧・行動フローを4段階以上記載する");

  for (const page of roughPages) {
    const name = text(page?.title) || text(page?.slug) || "名称未設定ページ";
    if (!text(page?.role) || !text(page?.purpose) || !text(page?.contentFlow)) errors.push(`${name}: 役割・目的・ページ内の流れをすべて記載する`);
    const templateKey = classifyPage(page);
    const blueprint = PAGE_BLUEPRINTS[templateKey];
    const sections = array(page?.sections);
    if (page?.templateKey !== templateKey) errors.push(`${name}: templateKeyを${templateKey}にする`);
    if (sections.length !== blueprint.length) errors.push(`${name}: ${templateKey}型のエリア数を${blueprint.length}件にする（現在${sections.length}件）`);
    sections.forEach((section: any, index: number) => {
      const prefix = `${name} エリア${index + 1}`;
      const type = text(section?.type).toUpperCase();
      if (!allowedTypes.includes(type)) errors.push(`${prefix}: 表現形式を${allowedTypes.join(" / ")}から選ぶ`);
      if (blueprint[index] && type !== blueprint[index].type) errors.push(`${prefix}: ${templateKey}型の表現形式は${blueprint[index].type}に固定する`);
      if (!text(section?.heading || section?.title)) errors.push(`${prefix}: 見出しを記載する`);
      if (!text(section?.content) || !text(section?.purpose) || !text(section?.confirm)) errors.push(`${prefix}: 掲載内容・意図・確認事項をすべて記載する`);
      const requiredItems = blueprint[index]?.itemCount;
      if (requiredItems && array(section?.items).length < requiredItems) errors.push(`${prefix}: ${type}の具体例をitemsへ${requiredItems}件以上記載する`);
    });
  }

  const design = proposal?.designDirection ?? {};
  if (!Number.isInteger(Number(design.informationRank)) || Number(design.informationRank) < 1 || Number(design.informationRank) > 5) errors.push("情報表現の軸を1〜5で指定する");
  if (!Number.isInteger(Number(design.motionRank)) || Number(design.motionRank) < 1 || Number(design.motionRank) > 5) errors.push("動きの軸を1〜5で指定する");
  if (array(design.palette).length !== 5 || array(design.palette).some((color) => !/^#[0-9a-f]{6}$/i.test(text(color)))) errors.push("カラーパレットを#RRGGBBで5色指定する");

  return [...new Set(errors)];
}

export const PROPOSAL_QUALITY_RULES = `
- 主要ページはTOPを含めて5〜8ページ。予算が小さくても3ページ以下へ省略しない。少数ページ案が適切な場合も、まず推奨構成を提示し、削減は打ち合わせ事項にする。
- 主要ページにはTOPとお問い合わせを必ず含める。プライバシーポリシーは主要ページと同列にせず、pageType="utility"の共通・補助ページとして含める。
- slugは英小文字・数字・ハイフンのみで、全ページ重複させない。TOPは必ずtop。
- sitemapとroughPagesはslug単位で完全一致させる。
- 各ページにpageType（mainまたはutility）、role（役割）、purpose（目的）、contentFlow（閲覧順を矢印でつないだ流れ）を入れる。
- ページは内容に応じてtemplateKeyを選び、次の固定構成・順序を厳守する。ヒアリングに合わせて変更できるのは見出し・本文・items・CTA・確認事項であり、typeと順序は変更しない。
${blueprintSummary()}
- typeは HERO / LEAD / 3-COLUMN / CARD-GRID / LIST / COMPARISON / STEP-FLOW / FAQ / CTA / FORM / PROFILE / GALLERY / ACCESS のいずれか。単なるSECTIONは禁止。
- 各エリアに具体的な見出し・本文またはitems・CTA、およびcontent（掲載内容）・purpose（この表現の意図）・confirm（確認事項）を必ず入れる。
- 3-COLUMNなら3項目、STEP-FLOWなら手順、FAQなら質問例、FORMなら入力項目など、typeに対応する具体的な中身をitemsへ入れる。
- ヒアリングにない事実・数値・固有名詞は断定せず、confirmへ確認事項として記載する。
- デザイン方向性は「情報量・説明重視⇔視覚・印象重視」「シンプル・静的⇔アクティブ・動的」の2軸だけを1〜5で示し、さらに5色のpaletteを提示する。
`;
