"use client";

import { useState, useEffect, Fragment } from "react";
import { Poppins, Barlow_Condensed } from "next/font/google";
import { Logo } from "@/components/svgs";
import ReactGA from "react-ga4";
import { tokens } from "@/support/token";
import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v2";
import { getEventWithDateAndTime } from "./support";
import Footer from "@/components/Footer";
import Nav from "@/components/StickyNav";
import MessageCard, { MessageLink } from "@/components/MessageCard";

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

const messages = [
  {
    text: 'We’re studying data, help us learn more',
    link: {
      url: '/blog',
      title: 'Read more',
    }
  },
  {
    text: 'Check out our labs',
    link: {
      url: '/labs',
      title: 'Read more',
    }
  },
]

export async function getEventsByDay() {
  const url = "/.netlify/functions/events";
  const res = await fetch(url);

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  const events = data.events.map(getEventWithDateAndTime);

  return events.reduce((eventsByDay: Record<string, Event[]>, event: Event) => {
    if (!eventsByDay[event.date]) {
      eventsByDay[event.date] = [];
    }

    eventsByDay[event.date].push(event);

    return eventsByDay;
  }, {});
}

export default function Home({
  events,
  daysOfWeek,
}: {
  events: Event[];
  daysOfWeek: string[];
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<Event[]>(events);
  const [eventsByDay, setEventsByDay] = useState<Record<string, Event[]>>({});

  const fetchEvents = async () => {
    const data = await getEventsByDay();
    setEventsByDay(data);
  };

  const initGA = () => {
    ReactGA.initialize("G-KZCQP5FKYK");
  };

  useEffect(() => {
    fetchEvents();
    initGA();
  }, []);

  useEffect(() => {
    if (!selectedDate || !eventsByDay || !eventsByDay[selectedDate]) {
      return;
    }

    setSelectedEvents(eventsByDay[selectedDate]);
  }, [selectedDate, eventsByDay]);

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "10%",
            gap: "2rem",
          }}
        >
          <Logo style={{ width: "40%" }} />
          <h1
            className={fontPoppins.className}
            style={{
              textTransform: "uppercase",
              color: tokens.color.white,
              display: "flex",
              flexDirection: "column",
              lineHeight: 0.9,
              textAlign: "center",
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
      <Nav>
        <DayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          daysOfWeek={daysOfWeek}
        />
      </Nav>
      <section
        className="shows"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          padding: "3rem 0 1rem",
          gap: 20,
          width: "calc(100% - 40px)",
          maxWidth: 780,
        }}
      >
        {selectedEvents.map((event, index) => {
          const messageIndex = Math.floor(index / 4) % messages.length;
          return <Fragment key={`${index}_${event.slug}`}>
            <div
              className="show"
              date-date={new Date(event.start_date).toLocaleString()}
            >
              <EventCard event={event} />
            </div>
            {(index + 1) % 4 === 0 && messages.length > 0 ?
              <MessageCard message={messages[messageIndex]} theme={!!messageIndex}/>
            : ''}
          </Fragment>
        })}

      </section>
      <Footer />
      <style jsx>{`
        .show {
          width: 100%;
          @media (min-width: ${tokens.breakpoints.md}) {
            width: calc(50% - 10px);
          }
        }

        h1 {
          font-size: 2.8rem;
          letter-spacing: 0.28rem;

          @media (min-width: ${tokens.breakpoints.md}) {
            font-size: 4rem;
            letter-spacing: 0.4rem;
          }
        }

        span {
          font-size: 2.8rem;

          @media (min-width: ${tokens.breakpoints.md}) {
            font-size: 4rem;
          }
        }
      `}</style>
    </main>
  );
}
