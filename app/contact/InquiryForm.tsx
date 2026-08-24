"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "wsw-contact-form";

export default function InquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw || !formRef.current) return;
    try {
      const saved = JSON.parse(raw) as Record<string, string>;
      Object.entries(saved).forEach(([name, value]) => {
        const field = formRef.current?.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          if (field.type === "checkbox") (field as HTMLInputElement).checked = value === "agreed";
          else field.value = value;
        }
      });
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const saved: Record<string, string> = {};
    for (const [key, value] of data.entries()) {
      if (key === "website") continue;
      saved[key] = String(value);
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    window.location.assign("/contact/confirm/");
  }

  return <form ref={formRef} className="inquiry-form" onSubmit={handleSubmit}>
    <p className="form-required-note"><span>必須</span>は入力必須項目です。</p>
    <label><span>お名前 <b>必須</b></span><input name="name" autoComplete="name" maxLength={100} required /></label>
    <label><span>メールアドレス <b>必須</b></span><input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
    <label><span>会社名・屋号</span><input name="company" autoComplete="organization" maxLength={150} /></label>
    <label><span>対象サイトURL</span><input type="url" name="url" inputMode="url" maxLength={500} placeholder="https://" /></label>
    <label><span>相談したい内容 <b>必須</b></span><select name="service" required defaultValue=""><option value="" disabled>選択してください</option><option>Webサイトの新規作成</option><option>Webサイトのリニューアル</option><option>SEO/アクセス解析について</option><option>何を依頼すべきか相談したい</option><option>その他</option></select></label>
    <label><span>相談内容</span><textarea name="message" rows={8} maxLength={4000} placeholder="現在の状況や相談したいことなど、分かる範囲でご記入ください。" /></label>
    <label className="form-consent"><input type="checkbox" name="consent" value="agreed" required /><span><a href="/about#privacy" target="_blank">個人情報の取り扱い</a>に同意する <b>必須</b></span></label>
    <div className="form-trap" aria-hidden="true"><label>この項目は入力しないでください<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="button button--primary" type="submit">入力内容を確認する <b>→</b></button>
  </form>;
}
