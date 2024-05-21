import { useState, useEffect, ReactNode } from "react";
import { Logo, MapIcon } from "@/components/svgs";
import throttle from "@/support/throttle";
import { tokens } from "@/support/token";
import Link from "next/link";

const Nav = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [isStuck, setIsStuck] = useState(false);
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const viewportHeight = document.documentElement.clientHeight;

      if (scrollY < viewportHeight - 200) {
        setIsStuck(false);
      } else {
        setIsStuck(true);
      }
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0.5rem 0",
        gap: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 40,
        transition: "opacity ease-in-out 0.3s",
        backgroundImage: isStuck
          ? `linear-gradient(
        180deg,
        #00050c 0%,
        #001126 70%,
        rgba(0, 0, 0, 0)
      )`
          : "",
      }}
    >
      <a
        className="nav-logo"
        href="/"
        title="Chicago Music Compass"
        style={{
          display: "flex",
          flexShrink: 0,
          paddingLeft: "1rem",
          transition: "opacity ease-in-out 0.3s",
          opacity: isStuck ? 1 : 0,
        }}>
        <Logo />
      </a>
      {children}
      <a
        className="nav-map"
        href="/chicago/events"
        style={{
          display: "flex",
          paddingRight: "1rem",
          flexShrink: 0,
          transition: "opacity ease-in-out 0.3s",
          opacity: isStuck ? 1 : 0,
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
