"use client";

import { FormEvent, useState } from "react";

export default function InquiryForm() {
  const [notice, setNotice] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(true);
  }
  return <form className="inquiry-form" onSubmit={handleSubmit}>
    <p className="form-required-note"><span>必須</span>は入力必須項目です。</p>
    <label><span>お名前 <b>必須</b></span><input name="name" autoComplete="name" required /></label>
    <label><span>メールアドレス <b>必須</b></span><input type="email" name="email" autoComplete="email" required /></label>
    <label><span>会社名・屋号</span><input name="company" autoComplete="organization" /></label>
    <label><span>対象サイトURL</span><input type="url" name="url" inputMode="url" placeholder="https://" /></label>
    <label><span>希望サービス <b>必須</b></span><select name="service" required defaultValue=""><option value="" disabled>選択してください</option><option>まず相談したい</option><option>サイトを診断してほしい</option><option>既存サイトを改善したい</option><option>ページを制作してほしい</option><option>サイト全体を制作してほしい</option><option>運用について相談したい</option><option>その他</option></select></label>
    <label><span>予算感</span><select name="budget" defaultValue=""><option value="">選択してください</option><option>1万円未満</option><option>1〜5万円</option><option>5〜10万円</option><option>10〜30万円</option><option>30万円以上</option><option>まだ決めていない</option></select></label>
    <label><span>希望時期</span><input name="schedule" placeholder="例：3か月以内、未定" /></label>
    <label><span>相談内容 <b>必須</b></span><textarea name="message" rows={8} required placeholder="現在困っていること、実現したいことなどをご記入ください。" /></label>
    <label className="form-consent"><input type="checkbox" required /><span><a href="/about#privacy" target="_blank">個人情報の取り扱い</a>に同意する <b>必須</b></span></label>
    {notice && <p className="form-notice" role="status"><b>送信機能は現在準備中です。</b><br />入力内容は送信・保存されていません。受付開始まで今しばらくお待ちください。</p>}
    <button className="button button--primary" type="submit">入力内容を確認する <b>→</b></button>
  </form>;
}

