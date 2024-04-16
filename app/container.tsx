"use client";

import { useState, useEffect, useRef } from "react";
import { Flaminfo, Logo } from "@/components/svgs";
import { tokens } from "@/support/token";
import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v2";
import { getEventWithDateAndTime } from "./support";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";


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

  const scrolltoHash = function (element_id: string) {
    const element = document.getElementById(element_id)
    element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

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
      <Nav>
        <DayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          daysOfWeek={daysOfWeek}
        />
      </Nav>
      <section className="shows"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
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
          padding-top: 10%;
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
        .shows {
          width: calc(100% - 40px);
          max-width: 780px;
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
