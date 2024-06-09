import { Poppins, Barlow_Condensed } from "next/font/google";

import { Logo } from "@/components/svgs";
import { tokens } from "@/support/token";

const fontPoppins = Poppins({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const fontBarlow_Condensed = Barlow_Condensed({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function Splash() {
  return (
    <header
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100vw",
        height: "calc(100vh - 80px)",
      }}
    >
      <div
        style={{
          display: "sticky",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "10%",
          gap: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Logo style={{ width: "40%" }} />
        </div>
        <h1
          className={fontPoppins.className}
          style={{
            textTransform: "uppercase",
            color: tokens.color.white,
            display: "flex",
            flexDirection: "column",
            lineHeight: 0.9,
            textAlign: "center",
            fontSize: 64,
          }}
        >
          Chicago
          <span
            className={fontBarlow_Condensed.className}
            style={{
              color: tokens.color.lightBlue,
              letterSpacing: 0,
            }}
          >
            Music Compass
          </span>
        </h1>
      </div>
    </header>
  );
}
