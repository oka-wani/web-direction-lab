import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type TurnstileResult = { success: boolean; action?: string; "error-codes"?: string[] };
const json = (status:number,message:string)=>Response.json({message},{status});
const get=(data:FormData,key:string)=>typeof data.get(key)==="string"?String(data.get(key)).trim():"";
const getAll=(data:FormData,key:string)=>data.getAll(key).map(String).map((value)=>value.trim()).filter(Boolean);
const escapeHtml=(input:string)=>input.replace(/[&<>"']/g,(character)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[character]!);
const configured=(input:string|undefined)=>Boolean(input&&!input.startsWith("SET_IN_"));
const ADMIN_EMAIL="contact@wani-san.com";

const known=new Set(["name","email","company","industry","location","currentUrl","sns","launch","background","purpose","problem","target","strength1","strength2","strength3","content","cta","mood","colors","reference1","referenceNote1","reference2","referenceNote2","materials","functions","updates","other","consent","website","cf-turnstile-response"]);
const multiKeys=["purpose","content","mood","materials","functions","updates"] as const;

export const POST:APIRoute=async({request})=>{
  const contentType=request.headers.get("content-type")??"";
  if(!contentType.includes("multipart/form-data")&&!contentType.includes("application/x-www-form-urlencoded"))return json(415,"送信形式が正しくありません。");
  const origin=request.headers.get("origin");
  if(origin&&new URL(origin).host!==new URL(request.url).host)return json(403,"送信元を確認できませんでした。");
  let data:FormData;
  try{data=await request.formData();}catch{return json(400,"入力内容を読み取れませんでした。");}
  if([...data.keys()].some((key)=>!known.has(key)))return json(400,"想定外の入力項目が含まれています。");
  if(get(data,"website"))return json(200,"受付しました。");

  const input={
    name:get(data,"name"),email:get(data,"email"),company:get(data,"company"),industry:get(data,"industry"),location:get(data,"location"),currentUrl:get(data,"currentUrl"),sns:get(data,"sns"),launch:get(data,"launch"),background:get(data,"background"),purpose:getAll(data,"purpose"),problem:get(data,"problem"),target:get(data,"target"),strengths:[get(data,"strength1"),get(data,"strength2"),get(data,"strength3")].filter(Boolean),content:getAll(data,"content"),cta:get(data,"cta"),mood:getAll(data,"mood"),colors:get(data,"colors"),references:[{url:get(data,"reference1"),note:get(data,"referenceNote1")},{url:get(data,"reference2"),note:get(data,"referenceNote2")}].filter((item)=>item.url||item.note),materials:getAll(data,"materials"),functions:getAll(data,"functions"),updates:getAll(data,"updates"),other:get(data,"other")
  };

  const missing:string[]=[];
  if(!input.name)missing.push("お名前");
  if(!input.email)missing.push("メールアドレス");
  if(!input.company)missing.push("会社名・店舗名・サービス名");
  if(!input.industry)missing.push("業種");
  if(input.purpose.length===0)missing.push("Webサイトの目的");
  if(!input.target)missing.push("見てほしい人");
  if(!input.cta)missing.push("最終的にしてほしい行動");
  if(get(data,"consent")!=="agreed")missing.push("個人情報の取り扱いへの同意");
  if(missing.length)return json(400,`必須項目を確認してください：${missing.join("、")}`);

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))return json(400,"メールアドレスの形式を確認してください。");
  for(const url of [input.currentUrl,...input.references.map((item)=>item.url)].filter(Boolean)){try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol))throw new Error();}catch{return json(400,"URLの形式を確認してください。");}}
  const scalarValues=[input.name,input.email,input.company,input.industry,input.location,input.currentUrl,input.sns,input.launch,input.background,input.problem,input.target,input.cta,input.colors,input.other,...input.strengths,...input.references.flatMap((item)=>[item.url,item.note])];
  if(scalarValues.some((value)=>value.length>5000))return json(400,"入力文字数が上限を超えています。");
  if(multiKeys.some((key)=>getAll(data,key).length>30))return json(400,"選択項目が多すぎます。");

  const token=get(data,"cf-turnstile-response");
  if(!token||!env.TURNSTILE_SECRET_KEY)return json(400,"Bot確認を完了してください。");
  const verification=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:request.headers.get("CF-Connecting-IP"),idempotency_key:crypto.randomUUID()})});
  const turnstile=await verification.json() as TurnstileResult;
  if(!verification.ok||!turnstile.success||turnstile.action!=="hearing")return json(400,"Bot確認に失敗しました。もう一度お試しください。");

  if(!configured(env.RESEND_API_KEY)||!configured(env.CONTACT_FROM_EMAIL))return json(503,"現在送信を受け付けられません。時間を置いてもう一度お試しください。");

  const hearingId=`H-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  const sentAt=new Intl.DateTimeFormat("ja-JP",{dateStyle:"medium",timeStyle:"medium",timeZone:"Asia/Tokyo"}).format(new Date());
  const rows:[string,string][]=[
    ["受付ID",hearingId],["お名前",input.name],["メールアドレス",input.email],["会社名・店舗名・サービス名",input.company],["業種",input.industry],["所在地・商圏",input.location||"未入力"],["現在のWebサイト",input.currentUrl||"未入力"],["SNS",input.sns||"未入力"],["希望公開時期",input.launch||"未入力"],["制作のきっかけ",input.background||"未入力"],["目的",input.purpose.join(" / ")],["課題",input.problem||"未入力"],["ターゲット",input.target],["特に伝えたいこと",input.strengths.join(" / ")||"未入力"],["掲載したい内容",input.content.join(" / ")||"未選択"],["メインCTA",input.cta],["デザインの雰囲気",input.mood.join(" / ")||"未選択"],["色",input.colors||"未入力"],["参考サイト",input.references.map((item)=>`${item.url||"URL未入力"}${item.note?`（${item.note}）`:""}`).join("\n")||"未入力"],["素材",input.materials.join(" / ")||"未選択"],["必要機能",input.functions.join(" / ")||"未選択"],["更新内容",input.updates.join(" / ")||"未選択"],["その他",input.other||"未入力"],["送信日時",sentAt]
  ];
  const text=rows.map(([label,value])=>`${label}: ${value}`).join("\n\n");
  const html=rows.map(([label,value])=>`<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replace(/\n/g,"<br>")}</p>`).join("");
  const generationData={version:1,hearingId,submittedAt:new Date().toISOString(),project:{name:input.company,industry:input.industry,location:input.location,currentUrl:input.currentUrl,sns:input.sns,launch:input.launch,background:input.background},strategy:{purposes:input.purpose,problem:input.problem,target:input.target,strengths:input.strengths,cta:input.cta},structure:{requestedContents:input.content,functions:input.functions,updates:input.updates},design:{moods:input.mood,colors:input.colors,references:input.references},materials:input.materials,other:input.other};
  const structured=JSON.stringify(generationData,null,2);

  const response=await fetch("https://api.resend.com/emails/batch",{method:"POST",headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},body:JSON.stringify([
    {from:env.CONTACT_FROM_EMAIL,to:[ADMIN_EMAIL],reply_to:input.email,subject:`【WSW ヒアリング】${input.company} / ${input.name}様`,text:`${text}\n\n--- ROUGH_GENERATION_DATA ---\n${structured}`,html:`${html}<hr><h2>ROUGH_GENERATION_DATA</h2><pre style="white-space:pre-wrap">${escapeHtml(structured)}</pre>`},
    {from:env.CONTACT_FROM_EMAIL,to:[input.email],reply_to:ADMIN_EMAIL,subject:"【Wani san Web】制作ヒアリングを受け付けました",text:`${input.name}様\n\n制作ヒアリングへのご回答ありがとうございます。受付IDは ${hearingId} です。回答内容をもとにサイト構成とラフ案を整理します。\n\n${text}`,html:`<p>${escapeHtml(input.name)}様</p><p>制作ヒアリングへのご回答ありがとうございます。受付IDは <strong>${escapeHtml(hearingId)}</strong> です。</p><p>回答内容をもとにサイト構成とラフ案を整理します。</p>${html}`}
  ])});
  if(!response.ok){console.error(JSON.stringify({event:"hearing_resend_error",status:response.status,body:await response.text()}));return json(502,"メール送信に失敗しました。時間を置いてもう一度お試しください。");}
  console.log(JSON.stringify({event:"hearing_sent",hearingId,company:input.company,sentAt}));
  return Response.json({message:"受付しました。",hearingId},{status:200});
};

export const ALL:APIRoute=()=>json(405,"POSTメソッドのみ利用できます。");
