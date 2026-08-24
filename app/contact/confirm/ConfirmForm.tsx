"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "wsw-contact-form";

type SavedContact = {
  name: string;
  email: string;
  company?: string;
  url?: string;
  service: string;
  message?: string;
  consent: string;
};

export default function ConfirmForm() {
  const [data, setData] = useState<SavedContact | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<"loading" | "ready" | "error">("loading");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.location.replace("/contact/");
      return;
    }
    try {
      setData(JSON.parse(raw) as SavedContact);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.replace("/contact/");
    }
  }, []);

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
    } else script.addEventListener("load", renderWidget, { once: true });

    const timer = window.setInterval(() => {
      if (window.turnstile) {
        renderWidget();
        if (widgetIdRef.current) window.clearInterval(timer);
      }
    }, 100);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data || status === "sending") return;
    if (turnstileStatus !== "ready") {
      setStatus("error");
      setMessage("Bot確認が完了するまでお待ちください。");
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const token = event.currentTarget.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value;
    if (token) formData.append("cf-turnstile-response", token);

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData, headers: { Accept: "application/json" } });
      const result = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(result?.message || "送信できませんでした。時間を置いてもう一度お試しください。");
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.assign("/contact/thanks/");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "送信できませんでした。時間を置いてもう一度お試しください。");
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      setTurnstileStatus("loading");
    }
  }

  if (!data) return null;

  const summary = [
    ["お名前", data.name],
    ["メールアドレス", data.email],
    ["会社名・屋号", data.company],
    ["対象サイトURL", data.url],
    ["相談したい内容", data.service],
    ["相談内容", data.message],
  ];

  return <form className="inquiry-form inquiry-form--confirm" onSubmit={handleSubmit}>
    <section className="form-confirm" aria-labelledby="confirm-title">
      <span>CONFIRM</span><h1 id="confirm-title">入力内容をご確認ください。</h1>
      <p>内容に問題がなければ、ページ下部の「この内容で送信する」を押してください。</p>
      <dl>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "未入力"}</dd></div>)}</dl>
    </section>

    <div className="form-turnstile" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div ref={turnstileRef} />
      {turnstileStatus === "loading" && <p>Bot確認を行っています。確認が完了してから送信してください。</p>}
      {turnstileStatus === "error" && <p role="alert">Bot確認を表示できませんでした。ページを再読み込みしてください。</p>}
    </div>
    {status === "error" && <p className="form-notice" role="alert"><b>送信できませんでした。</b><br />{message}</p>}
    <button className="form-back" type="button" onClick={() => window.location.assign("/contact/")}>入力内容を修正する</button>
    <button className="button button--primary" type="submit" disabled={status === "sending" || turnstileStatus !== "ready"}>{status === "sending" ? "送信中…" : "この内容で送信する"} <b>→</b></button>
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
