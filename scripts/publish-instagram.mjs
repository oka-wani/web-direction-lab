import { readFile, writeFile } from "node:fs/promises";

const arg = (name) => process.argv[process.argv.indexOf(`--${name}`) + 1];
const videoUrl = arg("video-url");
const metadataPath = arg("metadata");
const output = arg("output") || "instagram-result.json";
if (!videoUrl || !metadataPath) throw new Error("--video-url and --metadata are required.");
const required = ["INSTAGRAM_USER_ID", "INSTAGRAM_ACCESS_TOKEN"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing GitHub Actions secrets: ${missing.join(", ")}`);
const publication = JSON.parse(await readFile(metadataPath, "utf8"));
const video = publication.shortVideo;
const base = `https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION || "v25.0"}`;
const post = async (path, params) => {
  const response = await fetch(`${base}/${path}`, { method: "POST", body: new URLSearchParams({ ...params, access_token: process.env.INSTAGRAM_ACCESS_TOKEN }) });
  const result = await response.json();
  if (!response.ok) throw new Error(`Instagram API error ${response.status}: ${JSON.stringify(result)}`);
  return result;
};
const caption = `${video.hook}\n\n${video.cta}\n\n※音声はAIで生成しています。\n#効率化 #行動経済 #仕事術`;
const container = await post(`${process.env.INSTAGRAM_USER_ID}/media`, { media_type: "REELS", video_url: videoUrl, caption, share_to_feed: "true" });
let status;
for (let attempt = 0; attempt < 60; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 10_000));
  const response = await fetch(`${base}/${container.id}?fields=status_code,status&access_token=${encodeURIComponent(process.env.INSTAGRAM_ACCESS_TOKEN)}`);
  status = await response.json();
  if (!response.ok) throw new Error(`Instagram status error ${response.status}: ${JSON.stringify(status)}`);
  if (status.status_code === "FINISHED") break;
  if (["ERROR", "EXPIRED"].includes(status.status_code)) throw new Error(`Instagram container failed: ${JSON.stringify(status)}`);
}
if (status?.status_code !== "FINISHED") throw new Error("Instagram video processing timed out.");
const published = await post(`${process.env.INSTAGRAM_USER_ID}/media_publish`, { creation_id: container.id });
const saved = { id: published.id, url: `https://www.instagram.com/reel/${published.id}/`, publishedAt: new Date().toISOString() };
await writeFile(output, `${JSON.stringify(saved, null, 2)}\n`);
console.log(saved.id);
