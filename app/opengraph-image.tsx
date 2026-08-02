import { ImageResponse } from "next/og";

export const alt = "Wani san Web｜小さな会社の集客と業務を改善する";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "82px", background: "#fff", color: "#17352A", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "720px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "22px", marginBottom: "54px", fontSize: "42px", fontWeight: 800 }}>
          <span style={{ display: "flex", width: "116px", height: "58px", alignItems: "center", justifyContent: "center", borderRadius: "18px 18px 30px 18px", background: "#075B3A", color: "#A8D65E", fontSize: "30px" }}>WSW</span>
          Wani san Web
        </div>
        <h1 style={{ margin: 0, fontSize: "68px", lineHeight: 1.28, letterSpacing: "-0.05em" }}>小さな会社の、<br />集客と業務を改善する。</h1>
        <p style={{ margin: "34px 0 0", color: "#557066", fontSize: "26px" }}>Webマーケティング × AI・業務改善</p>
      </div>
      <div style={{ display: "flex", width: "265px", height: "400px", borderRadius: "132px 132px 34px 34px", background: "#F1F7F3", alignItems: "center", justifyContent: "center", color: "#075B3A", fontSize: "82px", fontWeight: 900 }}>W</div>
    </div>, size,
  );
}
