"use client";
import { InfoBtn, Logo, LogoText } from "@/components/svgs";
import { tokens } from "@/support/token";
import Slider from "@/components/Slider";
import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/perf";

export default function Home({ events }: { events: Event[] }) {
  return <main>
      <header className="header">
        <div className="brand" >
          <Logo />
          <LogoText />
        </div>
        <Slider />
      </header>
      <nav>
        <div
          style={{
            width: '60px',
            display: 'flex',
            flexShrink: '0',
          }}
        >
          <Logo />
        </div>
        <DayPicker />
        <div
          style={{
            width: '30px',
            display: 'flex',
            flexShrink: '0',
          }}
        ><InfoBtn /></div>
      </nav>
      <section className="eventList">
        {events.map(event => <EventCard key={event.slug} event={event} />)}
      </section>
      <style jsx>{`
        main {
          background-image: linear-gradient(180deg, #00050C 0%, #001126 70%, #001E43 100%);
          width: 100%;
          color: ${tokens.color.white};
          font-size: 48px;
          height: 100vh;
          overflow: scroll;
          flex-direction: column;
        }
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          width: 100vw;
          height: calc(100vh - 80px);
        }
        .brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 20%;
          gap: 2rem;
          width: 60vw;
          @media (min-width: ${tokens.breakpoints.md}) {
            width: 40vw;
          }
          @media (min-width: ${tokens.breakpoints.lg}) {
            width: 25vw;
          }
          svg:first-child {
            width: 40%;
            margin-left: -15%;
          }
        }
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: .5rem 1rem;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        section.eventList {
          position: sticky;
          top: 80px;
          overflow: scroll;
          height: calc(100vh - 80px);
        }
      `}</style>
    </main>;
}
