import { InfoBtn, Logo, LogoText } from "@/components/svgs";
import { tokens } from "@/support/token";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v2";

export default function Home({ events }: { events: Event[] }) {
  return (
    <main
      style={{
        backgroundImage: `linear-gradient(
          180deg,
          #00050c 0%,
          #001126 70%,
          #001e43 100%
        )`,
        width: "100%",
        color: tokens.color.white,
        fontSize: 48,
        height: "100vh",
        overflow: "scroll",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          width: "100vw",
          height: "calc(100vh - 80px)",
        }}
      >
        <div className="brand">
          <Logo />
          <LogoText />
        </div>
      </header>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          gap: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: "60px",
            display: "flex",
            flexShrink: "0",
          }}
        >
          <Logo />
        </div>

        <div
          style={{
            width: "30px",
            display: "flex",
            flexShrink: "0",
          }}
        >
          <InfoBtn />
        </div>
      </nav>
      <section
        style={{
          position: "sticky",
          top: 80,
        }}
      >
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </section>
    </main>
  );
}
