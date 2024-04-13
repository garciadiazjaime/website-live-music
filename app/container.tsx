"use client";

import { useState, useEffect } from "react";

import { InfoBtn, Logo, LogoText } from "@/components/svgs";
import { tokens } from "@/support/token";
import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v2";

export async function getEventsByDay() {
  const url = "/.netlify/functions/events";
  const res = await fetch(url);

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  return data.reduce((eventsByDay: Record<string, Event[]>, event: Event) => {
    const day = new Date(event.start_date).toJSON().split("T")[0];

    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }

    eventsByDay[day].push(event);

    return eventsByDay;
  }, {});
}

export default function Home({
  events,
  today,
}: {
  events: Event[];
  today: string;
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
        <DayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          today={today}
        />
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

      <style jsx>{`
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
      `}</style>
    </main>
  );
}
