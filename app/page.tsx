import Intro from "./intro";
import { tokens } from "@/support/token";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: tokens.color.primary,
        color: tokens.color.white,
        fontSize: 48,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          border: `1px dotted ${tokens.color.white}`,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Header
      </div>
      <div
        style={{
          border: `1px dotted ${tokens.color.white}`,
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Filters: Day & Genre
      </div>

      <div
        style={{
          border: `1px dotted ${tokens.color.white}`,
          minHeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        List of events [column]
      </div>

      <Intro />
    </div>
  );
}
