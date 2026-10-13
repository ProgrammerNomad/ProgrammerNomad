import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site-config";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0B0C0B",
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#F5F5F0",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 32, color: "#B5FF43", marginTop: 16 }}>
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
