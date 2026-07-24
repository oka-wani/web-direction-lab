import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const args = Object.fromEntries(process.argv.slice(2).map((value, index, all) => value.startsWith("--") ? [value.slice(2), all[index + 1]] : null).filter(Boolean));
if (!args.input || !args.output) throw new Error("Usage: node scripts/render-short-video.mjs --input <json> --output <mp4> [--audio-file <audio>]");

const input = JSON.parse(await readFile(args.input, "utf8"));
const video = input.shortVideo;
if (!video) throw new Error("The publication does not contain shortVideo.");
await mkdir(dirname(args.output), { recursive: true });

const narrationPath = resolve(dirname(args.output), `${basename(args.output, ".mp4")}-narration.mp3`);
if (args["audio-file"]) {
  await exec("cp", [resolve(args["audio-file"]), narrationPath]);
} else {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required to generate narration.");
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || "onyx",
      input: `${video.hook}。${video.script}。${video.cta}`,
      instructions: "落ち着いた低めの男性的な日本語音声。明瞭に、通常より少し速いテンポで、知的だが親しみやすく話してください。",
      response_format: "mp3",
    }),
  });
  if (!response.ok) throw new Error(`OpenAI speech API error ${response.status}: ${await response.text()}`);
  await writeFile(narrationPath, Buffer.from(await response.arrayBuffer()));
}

const { stdout } = await exec("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", narrationPath]);
const duration = Math.max(10, Number.parseFloat(stdout.trim()));
const sceneDuration = duration / video.scenes.length;
const assPath = resolve(dirname(args.output), `${basename(args.output, ".mp4")}.ass`);
const assTime = (seconds) => {
  const value = Math.max(0, seconds);
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const secs = (value % 60).toFixed(2).padStart(5, "0");
  return `${hours}:${String(minutes).padStart(2, "0")}:${secs}`;
};
const escapeAss = (text) => String(text).replaceAll("\\", "\\\\").replaceAll("{", "\\{").replaceAll("}", "\\}").replace(/\n/g, "\\N");
const dialogues = video.scenes.map((scene, index) => {
  const start = index * sceneDuration;
  const end = Math.min(duration, (index + 1) * sceneDuration);
  return `Dialogue: 0,${assTime(start)},${assTime(end)},Main,,0,0,0,,${escapeAss(scene.narration)}`;
}).join("\n");
await writeFile(assPath, `[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\nWrapStyle: 0\n\n[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\nStyle: Main,Noto Sans CJK JP,68,&H00FFFFFF,&H000000FF,&H0010243F,&H9010243F,-1,0,0,0,100,100,0,0,3,4,0,5,100,100,250,1\n\n[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n${dialogues}\n`, "utf8");

const title = escapeAss(video.hook);
const filter = `drawbox=x=0:y=0:w=1080:h=210:color=0xb8ed55:t=fill,drawtext=font='Noto Sans CJK JP':text='WEB GROWTH LAB':fontcolor=0x10243f:fontsize=42:x=(w-text_w)/2:y=72,drawtext=font='Noto Sans CJK JP':text='${title.replaceAll(":", "\\:").replaceAll("'", "’")}':fontcolor=white:fontsize=74:x=80:y=330:box=1:boxcolor=0x10243fcc:boxborderw=28,ass='${assPath.replaceAll("'", "'\\''").replaceAll(":", "\\:")}',drawtext=font='Noto Sans CJK JP':text='※音声はAIで生成しています':fontcolor=0xb8ed55:fontsize=30:x=(w-text_w)/2:y=h-120`;
await exec("ffmpeg", ["-y", "-f", "lavfi", "-i", `color=c=0x10243f:s=1080x1920:r=30:d=${duration}`, "-i", narrationPath, "-vf", filter, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", args.output], { maxBuffer: 10 * 1024 * 1024 });
console.log(JSON.stringify({ output: args.output, duration, title: video.hook }));
