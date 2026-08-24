"use client";

import { useEffect, useRef, useState } from "react";

const industries=["飲食・宿泊","小売・EC","美容・サロン","医療・福祉","士業・コンサルティング","不動産・建築","製造業","IT・Web・SaaS","教育・スクール","人材・採用","その他"];
const budgets=["5万円未満","5〜10万円","10〜30万円","30〜50万円","50〜100万円","100万円以上","相談して決めたい"];
const launches=["1か月以内","2〜3か月以内","3〜6か月以内","6か月以降","未定"];
const strengths=["価格","品質","スピード","実績","専門性","サポート","地域密着","独自性"];
const areas=["全国","地域限定","店舗周辺","オンライン","相談して決めたい"];
const goals=["問い合わせを増やす","予約・来店を増やす","商品・サービスを販売する","資料請求を増やす","認知・信頼性を高める","情報を分かりやすく伝える"];
const impressions=["シンプル","親しみやすい","信頼感","高級感","スタイリッシュ","明るい","落ち着いた","やわらかい","専門的"];
const materials=["ロゴ","写真","原稿","会社・商品資料","実績・事例","特になし"];
const functions=["問い合わせフォーム","予約機能","Googleマップ","Cookie同意","SNSへの導線","多言語","EC・決済","サイト内検索","特になし","相談して決めたい"];
const analytics=["GA4","Googleタグマネージャー","Search Console","Microsoft Clarity","Looker Studio","不要","相談して決めたい"];
const operations=["解析レポート","記事・お知らせ更新","画像・テキスト修正","保守・セキュリティ対応","運用は依頼しない","相談して決めたい"];
const stepNames=["制作概要","事業・ターゲット","目的・導線","構成・デザイン","機能・運用","確認"];

const labels:Record<string,string>={company:"Q1 会社・店舗・組織名",productionType:"Q2 今回の制作内容",budget:"Q3 想定予算",launch:"Q4 公開希望時期",industry:"Q5 業種",business:"Q6 具体的な事業・サービス内容",strength:"Q7 特に伝えたい強み",area:"Q8 対応エリア",primaryCustomer:"Q9 最も来てほしいお客様",customerNeeds:"Q10 そのお客様の悩み・期待",primaryGoal:"Q11 サイトの一番の目的",otherGoal:"Q12 その他の目的",mustHave:"Q13 必ず掲載したい情報",structureReference:"Q14 ページ構成・情報の見せ方で参考にしたいサイト",impression:"Q15 希望するサイトの印象",useColor:"Q16 使いたい色",avoidColor:"Q16 避けたい色",designReference:"Q17 色・雰囲気・デザインで参考にしたいサイト",material:"Q18 現在用意できる素材",cms:"Q19 CMSを導入しますか？",function:"Q20 必要な機能・連携",analytics:"Q21 解析・計測関連",domain:"Q22 ドメインの状況",server:"Q23 サーバー・公開環境",operation:"Q24 公開後の運用オプション",note:"Q25 補足・相談したいこと"};

export default function HearingForm(){
  const[step,setStep]=useState(1);const[status,setStatus]=useState<"idle"|"sending"|"error">("idle");const[message,setMessage]=useState("");const[turnstileStatus,setTurnstileStatus]=useState<"loading"|"ready"|"error">("loading");
  const formRef=useRef<HTMLFormElement>(null);const turnstileRef=useRef<HTMLDivElement>(null);const widgetIdRef=useRef<string|null>(null);const[token,setToken]=useState("");
  const storageKey=`wsw-hearing-v3:${token||"anonymous"}`;

  useEffect(()=>{const value=new URLSearchParams(window.location.search).get("token")||"";setToken(value);},[]);
  useEffect(()=>{if(!formRef.current||!token)return;const saved=localStorage.getItem(`wsw-hearing-v3:${token}`);if(!saved)return;try{const record=JSON.parse(saved) as Record<string,string[]>;for(const [name,values] of Object.entries(record)){const elements=formRef.current.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>(`[name="${CSS.escape(name)}"]`);elements.forEach(el=>{if(el instanceof HTMLInputElement&&(el.type==="checkbox"||el.type==="radio"))el.checked=values.includes(el.value);else if(values[0]!=null)el.value=values[0];});}}catch{}},[token]);
  function save(){if(!formRef.current||!token)return;const data=new FormData(formRef.current);const record:Record<string,string[]>={};data.forEach((v,k)=>{if(k==="cf-turnstile-response"||k==="website"||k==="token")return;(record[k]??=[]).push(String(v));});localStorage.setItem(storageKey,JSON.stringify(record));}

  useEffect(()=>{if(step!==6)return;const sitekey=import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;if(!sitekey){setTurnstileStatus("error");return;}let cancelled=false;const render=()=>{if(cancelled||!turnstileRef.current||!window.turnstile||widgetIdRef.current)return;widgetIdRef.current=window.turnstile.render(turnstileRef.current,{sitekey,action:"hearing",theme:"light",callback:()=>setTurnstileStatus("ready"),"expired-callback":()=>setTurnstileStatus("loading"),"error-callback":()=>setTurnstileStatus("error")});};let script=document.querySelector<HTMLScriptElement>('script[data-turnstile-script]');if(!script){script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.dataset.turnstileScript="true";script.addEventListener("load",render,{once:true});document.head.appendChild(script);}else render();const timer=window.setInterval(()=>{if(window.turnstile){render();if(widgetIdRef.current)clearInterval(timer);}},100);return()=>{cancelled=true;clearInterval(timer);};},[step]);

  function maxCheck(name:string,max:number){const checked=formRef.current?.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)??[];if(checked.length>max){const last=checked[checked.length-1];last.checked=false;setStatus("error");setMessage(`最大${max}つまで選択できます。`);}else{setStatus("idle");setMessage("");}save();}
  function validateStep(){const section=formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);if(!section)return true;const controls=Array.from(section.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>("input,select,textarea"));for(const control of controls){if(!control.checkValidity()){control.reportValidity();control.focus();return false;}}const requiredGroups:Array<[number,string,string]>=step===1?[[1,"productionType","今回の制作内容"]]:step===2?[[2,"strength","特に伝えたい強み"],[2,"area","対応エリア"]]:step===3?[[3,"primaryGoal","サイトの一番の目的"]]:step===4?[[4,"impression","希望するサイトの印象"]]:step===5?[[5,"cms","CMS"],[5,"domain","ドメインの状況"]]:[];for(const[,name,label]of requiredGroups){if(!formRef.current?.querySelector(`input[name="${name}"]:checked`)){setStatus("error");setMessage(`${label}を選択してください。`);return false;}}return true;}
  function next(){if(!validateStep())return;save();setStatus("idle");setMessage("");setStep(v=>Math.min(6,v+1));window.scrollTo({top:0,behavior:"smooth"});}
  function back(){save();setStatus("idle");setMessage("");setStep(v=>Math.max(1,v-1));window.scrollTo({top:0,behavior:"smooth"});}
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();if(step!==6){next();return;}if(turnstileStatus!=="ready"){setStatus("error");setMessage("Bot確認が完了するまでお待ちください。");return;}setStatus("sending");try{const data=new FormData(event.currentTarget);data.set("token",token);const response=await fetch("/api/hearing",{method:"POST",body:data,headers:{Accept:"application/json"}});const result=await response.json().catch(()=>null) as {message?:string}|null;if(!response.ok)throw new Error(result?.message||"送信できませんでした。");localStorage.removeItem(storageKey);window.location.assign("/hearing/thanks/");}catch(error){setStatus("error");setMessage(error instanceof Error?error.message:"送信できませんでした。");if(widgetIdRef.current)window.turnstile?.reset(widgetIdRef.current);setTurnstileStatus("loading");}}
  function values(){if(!formRef.current)return[] as [string,string][];const data=new FormData(formRef.current);return Object.entries(labels).map(([key,label])=>[label,data.getAll(key).map(String).filter(Boolean).join(" / ")||"未入力"] as [string,string]);}
  const progress=Math.round(step/6*100);
  const choices=(name:string,items:string[],type:"radio"|"checkbox"="checkbox",max?:number)=><div className="hearing-choice-grid">{items.map(item=><label key={item} className="hearing-choice"><input type={type} name={name} value={item} onChange={()=>max?maxCheck(name,max):save()}/><span>{item}</span></label>)}</div>;

  return <form ref={formRef} className="hearing-wizard" onSubmit={submit} onChange={save}>
    <input type="hidden" name="token" value={token}/><div className="form-trap" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off"/></div>
    <div className="hearing-progress"><div className="hearing-progress-top"><b>STEP {String(step).padStart(2,"0")} / 06</b><b>{progress}%</b></div><div className="hearing-progress-bar"><i style={{width:`${progress}%`}}/></div><div className="hearing-progress-steps">{stepNames.map((name,i)=><div className={i+1===step?"current":i+1<step?"done":""} key={name}><b>{i+1<step?"✓":String(i+1).padStart(2,"0")}</b><span>{name}</span></div>)}</div></div>

    <section data-step="1" hidden={step!==1} className="hearing-step"><small>約1分</small><div className="hearing-step-title"><h2>制作概要</h2><span>* 必須項目</span></div>
      <Field q="Q1" title="会社・店舗・組織名" required><input name="company" required placeholder="例：株式会社〇〇／〇〇カフェ"/></Field>
      <Field q="Q2" title="今回の制作内容" required>{choices("productionType",["新規サイト","リニューアル","LP・特設ページ","その他"],"radio")}</Field>
      <Field q="Q3" title="想定予算" required><select name="budget" required defaultValue=""><option value="" disabled>選択してください</option>{budgets.map(v=><option key={v}>{v}</option>)}</select><Hint>提案するページ数・機能・制作範囲の目安に使用します。</Hint></Field>
      <Field q="Q4" title="公開希望時期" optional><select name="launch" defaultValue=""><option value="">選択してください</option>{launches.map(v=><option key={v}>{v}</option>)}</select><Hint>制作スケジュールと対応範囲の調整に使用します。サイト構成案には直接影響しません。</Hint></Field>
    </section>

    <section data-step="2" hidden={step!==2} className="hearing-step"><small>約3分</small><div className="hearing-step-title"><h2>事業・ターゲット</h2><span>* 必須項目</span></div>
      <Field q="Q5" title="業種" required><select name="industry" required defaultValue=""><option value="" disabled>選択してください</option>{industries.map(v=><option key={v}>{v}</option>)}</select></Field>
      <Field q="Q6" title="具体的な事業・サービス内容" required description="誰に、何を提供しているかを2〜3行でご記入ください。"><textarea name="business" required rows={5} placeholder="例：東京都内の法人向けに、月額制のオフィス清掃を提供しています。土日・早朝にも対応しています。"/></Field>
      <Field q="Q7" title="特に伝えたい強み" required description="最大3つまで選択してください。">{choices("strength",strengths,"checkbox",3)}<Hint>提案への反映：ファーストビューの訴求、見出し、コンテンツの掲載順に反映します。</Hint></Field>
      <Field q="Q8" title="対応エリア" required>{choices("area",areas,"radio")}<Hint>提案への反映：地域情報、Googleマップ、ローカルSEO、対応エリアページの要否に反映します。</Hint></Field>
      <Field q="Q9" title="最も来てほしいお客様" required description="個人・法人、職種、年齢、地域など、分かる範囲で入力してください。"><textarea name="primaryCustomer" required rows={5} placeholder="例：東京23区にオフィスを持つ、従業員20〜100名程度の企業の総務担当者"/></Field>
      <Field q="Q10" title="そのお客様の悩み・期待" optional><textarea name="customerNeeds" rows={5} placeholder="例：品質を安定させたいが、業者選びや費用に不安がある"/></Field>
    </section>

    <section data-step="3" hidden={step!==3} className="hearing-step"><small>約2分</small><div className="hearing-step-title"><h2>目的・導線</h2><span>* 必須項目</span></div><div className="hearing-callout"><b>目的から、サイトの導線を提案します</b><p>主目的と事業内容をもとに、問い合わせ・予約などのメインCTAはこちらで設定します。</p></div>
      <Field q="Q11" title="サイトの一番の目的" required>{choices("primaryGoal",goals,"radio")}</Field>
      <Field q="Q12" title="その他の目的" optional description="複数選択">{choices("otherGoal",goals)}</Field>
    </section>

    <section data-step="4" hidden={step!==4} className="hearing-step"><small>約3分</small><div className="hearing-step-title"><h2>構成・デザイン</h2><span>* 必須項目</span></div>
      <Field q="Q13" title="必ず掲載したい情報" optional><textarea name="mustHave" rows={4} placeholder="例：料金表、導入事例、代表者のメッセージ"/></Field>
      <div className="hearing-subbox"><b>構成の参考</b><Field q="Q14" title="ページ構成・情報の見せ方で参考にしたいサイト" optional description="複数ある場合は、改行してURLと参考にしたい点をご記入ください。"><textarea name="structureReference" rows={5} placeholder={'https://example.com\nサービス説明から問い合わせまでの流れが分かりやすい'}/></Field></div>
      <Field q="Q15" title="希望するサイトの印象" required description="最大3つまで選択してください。">{choices("impression",impressions,"checkbox",3)}</Field>
      <Field q="Q16" title="使いたい色・避けたい色" optional><div className="hearing-two"><input name="useColor" placeholder="使いたい色：深い青、白"/><input name="avoidColor" placeholder="避けたい色　例：赤、蛍光色／特になし"/></div></Field>
      <div className="hearing-subbox"><b>デザインの参考</b><Field q="Q17" title="色・雰囲気・デザインで参考にしたいサイト" optional description="複数ある場合は、改行してURLと好きな点をご記入ください。"><textarea name="designReference" rows={5} placeholder={'https://example.com\n余白の使い方と落ち着いた色合いが好み'}/></Field></div>
      <Field q="Q18" title="現在用意できる素材" optional description="複数選択">{choices("material",materials)}</Field>
    </section>

    <section data-step="5" hidden={step!==5} className="hearing-step"><small>約2分</small><div className="hearing-step-title"><h2>機能・運用</h2><span>* 必須項目</span></div>
      <Field q="Q19" title="CMSを導入しますか？" required description="お知らせや記事などを、ご自身で更新するための仕組みです。">{choices("cms",["導入したい","不要","相談して決めたい"],"radio")}</Field>
      <Field q="Q20" title="必要な機能・連携" optional description="複数選択">{choices("function",functions)}</Field>
      <Field q="Q21" title="解析・計測関連" optional description="複数選択">{choices("analytics",analytics)}</Field>
      <Field q="Q22" title="ドメインの状況" required>{choices("domain",["取得済み","取得していない","分からない"],"radio")}</Field>
      <Field q="Q23" title="サーバー・公開環境" optional>{choices("server",["利用中の環境がある","利用できる環境がない","分からない"],"radio")}</Field>
      <Field q="Q24" title="公開後の運用オプション" optional description="複数選択">{choices("operation",operations)}</Field>
      <Field q="Q25" title="補足・相談したいこと" optional><textarea name="note" rows={5} placeholder="メール環境、既存サービスとの連携、セキュリティ要件などがあればご記入ください。"/></Field>
    </section>

    <section data-step="6" hidden={step!==6} className="hearing-step"><small>約1分</small><div className="hearing-step-title"><h2>入力内容の確認</h2><span>* 必須項目</span></div><div className="hearing-confirm-list">{step===6&&values().map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</div><label className="form-consent"><input type="checkbox" name="consent" value="agreed" required/><span><a href="/about#privacy" target="_blank">個人情報の取り扱い</a>に同意する <b>必須</b></span></label><div className="form-turnstile hearing-turnstile"><div ref={turnstileRef}/>{turnstileStatus==="loading"&&<p>Bot確認を行っています。</p>}{turnstileStatus==="error"&&<p>Bot確認を表示できませんでした。</p>}</div></section>

    {status==="error"&&<p className="form-notice" role="alert">{message}</p>}
    <div className="hearing-nav">{step>1?<button type="button" className="hearing-prev" onClick={back}>戻る</button>:<span/>}{step<6?<button type="button" className="hearing-next" onClick={next}>次へ進む　→</button>:<button type="submit" className="hearing-next" disabled={status==="sending"||turnstileStatus!=="ready"}>{status==="sending"?"送信中…":"この内容で送信する　→"}</button>}</div>
  </form>;
}

function Field({q,title,required,optional,description,children}:{q:string;title:string;required?:boolean;optional?:boolean;description?:string;children:React.ReactNode}){return <div className="hearing-field"><div className="hearing-field-title"><b>{q}</b><strong>{title}</strong>{required&&<em>必須</em>}{optional&&<span>任意</span>}</div>{description&&<p className="hearing-description">{description}</p>}{children}</div>}
function Hint({children}:{children:React.ReactNode}){return <p className="hearing-hint"><b>提案への反映：</b>{children}</p>}

declare global{interface Window{turnstile?:{render:(container:HTMLElement,options:{sitekey:string;action:string;theme:"light"|"dark"|"auto";callback:()=>void;"expired-callback":()=>void;"error-callback":()=>void})=>string;reset:(widgetId:string)=>void;};}}
