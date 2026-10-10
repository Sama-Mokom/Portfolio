import { ImageResponse } from "next/og";
export const alt =
  "Mokom — Software Engineer. Full-stack developer. Deliberate learner.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        width: "100%",
        height: "100%",
        background: "#faf9f6",
        color: "#111c24",
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 4 }}>
        MOKOM / ENGINEERING & IDEAS
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 80,
          lineHeight: 1.1,
          maxWidth: 950,
        }}
      >
        <span>Real problems.</span>
        <span>Considered solutions.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          borderTop: "1px solid #d8d8d3",
          paddingTop: 26,
        }}
      >
        <span>Nkeng Sama Mokom</span>
        <span>Buea, Cameroon</span>
      </div>
    </div>,
    size,
  );
}
