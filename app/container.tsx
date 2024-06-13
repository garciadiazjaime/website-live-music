"use client";

import { useState, useEffect, Fragment } from "react";
import ReactGA from "react-ga4";

import { tokens } from "@/support/token";
import DayPicker from "@/components/DayPicker";
import { Event } from "@/support/types";
import EventCard from "@/components/EventCard/v2";
import { getEventWithDateAndTime } from "./support";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import MessageCard from "@/components/MessageCard";
import Newsletter from '@/components/Newsletter';

const messages = [
  {
    text: "Learn how we built this site",
    link: {
      url: "/blog/how-cmc-was-built",
      title: "Read more",
    },
  },
  {
    text: "We’re building ML models with the data we’re collecting",
    link: {
      url: "/blog/artists-popularity-model",
      title: "See how",
    },
  },
  {
    text: "Test the popularity model yourself",
    link: {
      url: "/labs/artist-popularity-prediction",
      title: "Try it",
    },
  },
];

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
        className="shows"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          padding: "3rem 0 1rem",
          gap: 20,
          width: "calc(100% - 0px)",
          maxWidth: 780,
        }}
      >
        {selectedEvents.map((event, index) => {
          const messageIndex = Math.floor(index / 4) % messages.length;
          return (
            <Fragment key={`${index}_${event.slug}`}>
              <div
                className="show"
                date-date={new Date(event.start_date).toLocaleString()}
              >
                <EventCard event={event} />
              </div>
              {(index + 1) % 4 === 0 && messages.length > 0 ? (
                <MessageCard message={messages[messageIndex]} />
              ) : (
                ""
              )}
            </Fragment>
          );
        })}
      </section>
      <Newsletter />
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
    </>
  );
}
