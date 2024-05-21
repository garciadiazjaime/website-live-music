'use client'
import { ReactNode } from "react";
import { Logo, MapIcon } from "@/components/svgs";
import { tokens } from "@/support/token";

const Nav = ({ children }: { children: ReactNode | ReactNode[] }) => {

  return (
    <nav
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0.5rem 0",
        gap: "1rem",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="nav-logo"
        style={{
          display: "flex",
          flexShrink: 0,
          paddingLeft: "1rem",
        }}
      >
        <Logo />
      </div>
      {children}
      <a
        className="nav-map"
        href="/chicago/events"
        style={{
          display: "flex",
          paddingRight: "1rem",
          flexShrink: 0,
        }}
        aria-label="Map about Events in Chicago"
      >
        <MapIcon />
      </a>
      <style jsx>{`
        .nav-logo {
          width: 30px;

          @media (min-width: ${tokens.breakpoints.md}) {
            width: 50px;
          }
        }

        .nav-map {
          width: 25px;

          @media (min-width: ${tokens.breakpoints.md}) {
            width: 30px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Nav;
