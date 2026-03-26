import { ImageResponse } from "next/og"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"
export const alt = "СітіЧЕ — єдине вікно для взаємодії з Черкасами"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  const logo = readFileSync(join(process.cwd(), "public/1.png"))
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0c1a2e 0%, #0f2a4a 40%, #0e3a6b 70%, #0369a1 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: 200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Top right: logo with backdrop */}
        <div style={{
          position: "absolute", top: 44, right: 64,
          padding: "10px 16px", borderRadius: 16,
          background: "rgba(255,255,255,1)",
          border: "1px solid rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center",
        }}>
          <img src={logoSrc} style={{ height: 68, objectFit: "contain", imageRendering: "high-quality" }} />
        </div>

        {/* Top badge */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 72,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 18px",
            borderRadius: 100,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: 600, letterSpacing: "0.12em" }}>
            ОФІЦІЙНИЙ ПОРТАЛ ЧЕРКАС
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 96,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(100deg, #7dd3fc 0%, #38bdf8 50%, #e0f2fe 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              СітіЧЕ
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.2,
                maxWidth: 700,
              }}
            >
              Зручний пошук онлайн-сервісів міста
            </span>
          </div>

          {/* Description */}
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", maxWidth: 650, lineHeight: 1.5 }}>
            Від медицини та освіти до транспорту й держпослуг — все в одному місці
          </span>

          {/* Tags */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {["Медицина", "Освіта", "Транспорт", "Держпослуги", "Комунальні"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "6px 16px",
                  borderRadius: 100,
                  background: "rgba(56,189,248,0.12)",
                  border: "1px solid rgba(56,189,248,0.25)",
                  color: "#7dd3fc",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom right: domain */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 72,
            color: "rgba(255,255,255,0.3)",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          city-che.ck.ua
        </div>
      </div>
    ),
    { ...size }
  )
}
