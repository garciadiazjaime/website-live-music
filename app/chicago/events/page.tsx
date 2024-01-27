"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

import TagManager from "react-gtm-module";
import events from "../../../public/events.json";
import { Event } from "../../../support/types";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";

const tagManagerArgs = {
  gtmId: "GTM-5TDDZW8S",
};

function slugify(str: string) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const center = {
  lat: 41.8777569,
  lng: -87.6271142,
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const getEventID = (event: Event) =>
  `${slugify(event.name)}-${event.start_date.split("T")[0]}`;

const filterEventsByDate = (events: Event[], date: Date) =>
  events.filter(
    (event) =>
      new Date(event.start_date).toLocaleDateString() ===
      date.toLocaleDateString()
  );

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<Event[]>(
    filterEventsByDate(events, selectedDate)
  );
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [map, setMap] = useState<google.maps.Map>();

  const currentDay = new Date().getDay() - 1;

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (!map || !selectedEvents.length) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    selectedEvents.forEach((event) => {
      const latlng = new window.google.maps.LatLng(
        event.location.lat,
        event.location.lng
      );

      bounds.extend(latlng);
    });

    map.fitBounds(bounds);
  }, [map, selectedEvents]);

  const markerClickHandler = (event: Event) => {
    setSelectedEvent(event);
    const element = document.getElementById(getEventID(event));
    element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
  };

  useEffect(() => {
    const _events = filterEventsByDate(events, selectedDate);
    setSelectedEvents(_events);
  }, [selectedDate]);

  const dateHandler = (event: any) => {
    const diff = event.target.value - currentDay;
    const today = new Date();
    today.setDate(today.getDate() + diff);

    setSelectedDate(today);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header currentDay={currentDay} dateHandler={dateHandler} />
      <main className="h-full flex flex-col-reverse lg:flex-row flex-1">
        <section className="w-full lg:w-96 bg-gradient-to-b lg:bg-gradient-to-r from-fuchsia-950 to-gray-900">
          <div className="flex flex-row overflow-scroll lg:flex-col gap-4 snap-x snap-mandatory">
            {selectedEvents.map((event, index) => (
              <div
                key={index}
                className="w-5/6 md:w-1/2 lg:w-full shrink-0 mb-2 snap-x snap-center first:ml-12 lg:first:ml-0 last:mr-12 items-stretch"
                id={getEventID(event)}
              >
                <EventCard event={event} index={index} selected={selectedEvent && getEventID(event) === getEventID(selectedEvent)} />
              </div>
            ))}
          </div>
        </section>

        <section className="w-full lg:w-auto flex flex-1">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={10}
              center={center}
              onLoad={(map) => setMap(map)}
            >
              {selectedEvents.map((event, index) => {
                console.log(selectedEvent && getEventID(event) === getEventID(selectedEvent))
                return <MarkerF
                  key={index}
                  onClick={() => markerClickHandler(event)}
                  position={{
                    lat: event.location.lat,
                    lng: event.location.lng,
                  }}
                  options={{
                    icon: selectedEvent && getEventID(event) === getEventID(selectedEvent) ? '/images/marker-selected.webp' : '/images/marker.webp'
                  }}
                />
              })}
            </GoogleMap>
          )}
        </section>
      </main>
    </div>
  );
}
