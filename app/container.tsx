"use client";

import { useState, useEffect } from "react";
import ReactGA from "react-ga4";

import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v3";
import { getEventWithDateAndTime } from "./support";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Newsletter from "@/components/Newsletter";

export async function getEventsByDay() {
  const url = "/.netlify/functions/events";
  const res = await fetch(url);

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  const events = data.events
    .sort(
      (a: Event, b: Event) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .map(getEventWithDateAndTime);

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
    <>
      <Nav>
        <DayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          daysOfWeek={daysOfWeek}
        />
      </Nav>
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "3rem 1rem 1rem",
          gap: 20,
          maxWidth: 780,
        }}
      >
        {selectedEvents.map((event, index) => {
          return (
            <div
              key={`${index}_${event.slug}`}
              date-date={new Date(event.start_date).toLocaleString()}
              style={{ width: "100%" }}
            >
              <EventCard event={event} />
            </div>
          );
        })}
      </section>
      <Newsletter />
      <Footer />
    </>
  );
}
