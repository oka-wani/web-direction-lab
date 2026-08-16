"use client";

import { useEffect, useRef, useState } from "react";

export default function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<"loading" | "ready" | "error">("loading");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const sitekey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) {
      setTurnstileStatus("error");
      return;
    }

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !turnstileRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey,
        action: "contact",
        theme: "light",
        callback: () => setTurnstileStatus("ready"),
        "expired-callback": () => setTurnstileStatus("loading"),
        "error-callback": () => setTurnstileStatus("error"),
      });
    };

    renderWidget();
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = "true";
      script.addEventListener("load", renderWidget, { once: true });
      script.addEventListener("error", () => setTurnstileStatus("error"), { once: true });
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", renderWidget, { once: true });
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window.turnstile) {
        renderWidget();
        if (widgetIdRef.current) window.clearInterval(timer);
      } else if (attempts >= 100) {
        window.clearInterval(timer);
        setTurnstileStatus("error");
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (turnstileStatus !== "ready") {
      setStatus("error");
      setMessage("Bot確認が完了するまでお待ちください。");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: new FormData(event.currentTarget), headers: { Accept: "application/json" } });
      const result = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(result?.message || "送信できませんでした。時間を置いてもう一度お試しください。");
      window.location.assign("/contact/thanks/");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "送信できませんでした。時間を置いてもう一度お試しください。");
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      setTurnstileStatus("loading");
    }
  }
  return <form className="inquiry-form" onSubmit={handleSubmit}>
    <p className="form-required-note"><span>必須</span>は入力必須項目です。</p>
    <label><span>お名前 <b>必須</b></span><input name="name" autoComplete="name" maxLength={100} required /></label>
    <label><span>メールアドレス <b>必須</b></span><input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
    <label><span>会社名・屋号</span><input name="company" autoComplete="organization" maxLength={150} /></label>
    <label><span>対象サイトURL</span><input type="url" name="url" inputMode="url" maxLength={500} placeholder="https://" /></label>
    <label><span>相談したい内容 <b>必須</b></span><select name="service" required defaultValue=""><option value="" disabled>選択してください</option><option>何を依頼すべきか相談したい</option><option>Webサイトを制作・改善したい</option><option>Webサイトの運用を依頼したい</option><option>SEO・アクセス解析を相談したい</option><option>LLMO・AI検索対策を相談したい</option><option>Instagram運用を相談したい</option><option>Web広告を相談したい</option><option>AI・業務改善を相談したい</option><option>自動化ツールを制作したい</option><option>その他</option></select></label>
    <label><span>予算感</span><select name="budget" defaultValue=""><option value="">選択してください</option><option>1万円未満</option><option>1〜5万円</option><option>5〜10万円</option><option>10〜30万円</option><option>30万円以上</option><option>まだ決めていない</option></select></label>
    <label><span>希望時期</span><input name="schedule" maxLength={100} placeholder="例：3か月以内、未定" /></label>
    <label><span>相談内容 <b>必須</b></span><textarea name="message" rows={8} maxLength={4000} required placeholder="現在困っていること、実現したいこと、繰り返し行っている作業などをご記入ください。" /></label>
    <label className="form-consent"><input type="checkbox" name="consent" value="agreed" required /><span><a href="/about#privacy" target="_blank">個人情報の取り扱い</a>に同意する <b>必須</b></span></label>
    <div className="form-trap" aria-hidden="true"><label>この項目は入力しないでください<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-turnstile">
      <div ref={turnstileRef} />
      {turnstileStatus === "loading" && <p>Bot確認を行っています。確認が完了してから送信してください。</p>}
      {turnstileStatus === "error" && <p role="alert">Bot確認を表示できませんでした。ページを再読み込みしてください。</p>}
    </div>
    {status === "error" && <p className="form-notice" role="alert"><b>送信できませんでした。</b><br />{message}</p>}
    <button className="button button--primary" type="submit" disabled={status === "sending" || turnstileStatus !== "ready"}>{status === "sending" ? "送信中…" : "問い合わせを送信する"} <b>→</b></button>
  </form>;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        action: string;
        theme: "light" | "dark" | "auto";
        callback: () => void;
        "expired-callback": () => void;
        "error-callback": () => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}
