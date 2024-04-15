"use client";

import { useState, useEffect, useRef } from "react";

import { Flaminfo, Logo, MapIcon } from "@/components/svgs";
import { tokens } from "@/support/token";
import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v2";
import { getEventWithDateAndTime } from "./support";
import Link from "next/link";
import Footer from "@/components/Footer";


export async function getEventsByDay() {
  const url = "/.netlify/functions/events";
  const res = await fetch(url);

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  const events = data.map(getEventWithDateAndTime);

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
  const [navIsSticky, setNavIsSticky] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const fetchEvents = async () => {
    const data = await getEventsByDay();
    setEventsByDay(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedDate || !eventsByDay[selectedDate]) {
      return;
    }

    setSelectedEvents(eventsByDay[selectedDate]);
  }, [selectedDate, eventsByDay]);

  function throttle(func: any, limit: number) {
    let inThrottle:boolean;
    return function() {
        const args = arguments;
        if (!inThrottle) {
            func( args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
  }

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    const handleScroll = throttle(() => {
      const scrollY = mainElement.scrollTop;
      const viewportHeight = document.documentElement.clientHeight;

      if (scrollY < viewportHeight - 200) {
        setNavIsSticky(false);
      } else {
        setNavIsSticky(true);
      }
    }, 100);


    mainElement.addEventListener('scroll', handleScroll, { passive: true});

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrolltoHash = function (element_id: string) {
    const element = document.getElementById(element_id)
    element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  return (
    <main
      ref={mainRef}
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "scroll",
      }}
    >
      <header
        style={{
          display: "flex",
          position: 'relative',
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          width: "100vw",
          height: "calc(100vh - 80px)",
        }}
      >
        <div
          onClick={() => scrolltoHash('cmc')}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '2rem',
            cursor: 'pointer',
          }}
        >
          <Flaminfo />
        </div>
        <div className="brand">
          <Logo />
          <h1
            style={{
              textTransform: 'uppercase',
              fontFamily: 'Poppins',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 0.9,
              textAlign: 'center',
            }}
          >
            Chicago
            <span
              style={{
                fontFamily: 'Barlow Condensed',
                color: '#64C7F9',
                letterSpacing: '0',
              }}
            >Music Compass</span>
          </h1>
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
          zIndex: 40,
          transition: 'opacity ease-in-out 0.3s',
          backgroundImage: navIsSticky ? `linear-gradient(
            180deg,
            #00050c 0%,
            #001126 50%,
            rgba(0, 0, 0, 0)
          )`: '',
        }}
      >
        <div
          style={{
            width: "60px",
            display: "flex",
            flexShrink: "0",
            transition: 'opacity ease-in-out 0.3s',
            opacity: navIsSticky ? '1': '0',
          }}
        >
          <Logo />
        </div>
        <DayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          daysOfWeek={daysOfWeek}
        />
        <a
          href="/chicago/events"
          style={{
            width: "30px",
            display: "flex",
            flexShrink: "0",
            transition: 'opacity ease-in-out 0.3s',
            opacity: navIsSticky ? '1': '0',
          }}
        >
          <MapIcon />
        </a>
      </nav>
      <section
        style={{
          maxWidth: '780px',
          width: "100%",
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          margin: '0 auto',
          padding: '3rem 0',
          gap: '20px'
,        }}
      >
        {selectedEvents.map((event) => (
          <div key={event.slug} className="show"
          >
            <EventCard event={event} />
          </div>
        ))}
      </section>
      <Footer />
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400&family=Barlow+Condensed:wght@400&display=swap');
        .brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 20%;
          gap: 2rem;
          h1 {
            font-size: 2.8rem;
            letter-spacing: .28rem;
            @media (min-width: ${tokens.breakpoints.md}) {
              font-size: 4rem;
              letter-spacing: .4rem;
            }
            span {
              font-size: 2.8rem;
              @media (min-width: ${tokens.breakpoints.md}) {
                font-size: 4rem;
              }
            }
          }

          svg:first-child {
            width: 40%;
            margin-left: -15%;
          }
        }
        .show {
          width: 100%;
          @media (min-width: ${tokens.breakpoints.md}) {
            width: calc(50% - 10px);
          }
        }
      `}</style>
    </main>
  );
}
