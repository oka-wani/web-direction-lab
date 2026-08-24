"use client";

import { useEffect, useRef, useState } from "react";

export default function InquiryForm() {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [confirmation, setConfirmation] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<"loading" | "ready" | "error">("loading");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const heading = document.querySelector<HTMLElement>(".order-contact-wrap > .order-section-heading");
    if (heading) heading.hidden = step === "confirm";
    return () => {
      if (heading) heading.hidden = false;
    };
  }, [step]);

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
    if (step === "input") {
      const data = new FormData(event.currentTarget);
      setConfirmation(Object.fromEntries(Array.from(data.entries(), ([key, value]) => [key, String(value)])));
      setStatus("idle");
      setMessage("");
      setStep("confirm");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
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

  const summary = [
    ["お名前", confirmation.name],
    ["メールアドレス", confirmation.email],
    ["会社名・屋号", confirmation.company],
    ["対象サイトURL", confirmation.url],
    ["相談したい内容", confirmation.service],
    ["相談内容", confirmation.message],
  ];

  return <form className={`inquiry-form inquiry-form--${step}`} onSubmit={handleSubmit}>
    {step === "confirm" && <section className="form-confirm" aria-labelledby="confirm-title">
      <span>CONFIRM</span><h2 id="confirm-title">入力内容をご確認ください。</h2>
      <p>内容に問題がなければ、ページ下部の「この内容で送信する」を押してください。</p>
      <dl>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "未入力"}</dd></div>)}</dl>
    </section>}
    <p className="form-required-note"><span>必須</span>は入力必須項目です。</p>
    <label><span>お名前 <b>必須</b></span><input name="name" autoComplete="name" maxLength={100} required /></label>
    <label><span>メールアドレス <b>必須</b></span><input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
    <label><span>会社名・屋号</span><input name="company" autoComplete="organization" maxLength={150} /></label>
    <label><span>対象サイトURL</span><input type="url" name="url" inputMode="url" maxLength={500} placeholder="https://" /></label>
    <label><span>相談したい内容 <b>必須</b></span><select name="service" required defaultValue=""><option value="" disabled>選択してください</option><option>Webサイトの新規作成</option><option>Webサイトのリニューアル</option><option>SEO/アクセス解析について</option><option>何を依頼すべきか相談したい</option><option>その他</option></select></label>
    <label><span>相談内容</span><textarea name="message" rows={8} maxLength={4000} placeholder="現在の状況や相談したいことなど、分かる範囲でご記入ください。" /></label>
    <label className="form-consent"><input type="checkbox" name="consent" value="agreed" required /><span><a href="/about#privacy" target="_blank">個人情報の取り扱い</a>に同意する <b>必須</b></span></label>
    <div className="form-trap" aria-hidden="true"><label>この項目は入力しないでください<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-turnstile">
      <div ref={turnstileRef} />
      {turnstileStatus === "loading" && <p>Bot確認を行っています。確認が完了してから送信してください。</p>}
      {turnstileStatus === "error" && <p role="alert">Bot確認を表示できませんでした。ページを再読み込みしてください。</p>}
    </div>
    {status === "error" && <p className="form-notice" role="alert"><b>送信できませんでした。</b><br />{message}</p>}
    {step === "confirm" && <button className="form-back" type="button" onClick={() => { setStep("input"); setStatus("idle"); setMessage(""); }}>入力内容を修正する</button>}
    <button className="button button--primary" type="submit" disabled={status === "sending" || (step === "confirm" && turnstileStatus !== "ready")}>{status === "sending" ? "送信中…" : step === "input" ? "入力内容を確認する" : "この内容で送信する"} <b>→</b></button>
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
