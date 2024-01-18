"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

import TagManager from "react-gtm-module";
import Image from "next/image";
import Link from "next/link";

import SocialLinks from "../../../components/socialLinks";
import events from "../../../public/events.json";
import { Event } from "../../../support/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

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

const getImage = (event: Event): string => {
  const artist = event.artists?.find((artist) => artist.metadata?.image);
  if (artist) {
    return artist.metadata?.image!;
  }

  if (event.location?.metadata?.image) {
    return event.location.metadata.image;
  }

  return event.image;
};

const eventHandler = (event: Event) => window.open(event.url, "_blank");

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
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <>
      <Header currentDay={currentDay} dateHandler={dateHandler} />
      <main className="h-full flex flex-col-reverse lg:flex-row">
        <section className="w-full lg:w-1/2 bg-gradient-to-b lg:bg-gradient-to-r from-fuchsia-950 to-gray-900">
          {/* <h2 style={{ margin: "0 0 30px 0", fontSize: 30 }}>
            {selectedEvents.length} Events
          </h2> */}
          <div className="flex flex-row overflow-scroll lg:flex-col">
            {selectedEvents.map((event, index) => (
              <div
                key={index}
                className="w-5/6 flex flex-col shrink-0 items-end"
                id={getEventID(event)}
              >
                <Image
                  priority={index === 0}
                  src={getImage(event)}
                  width={300}
                  height={150}
                  alt={event.name}
                  className="object-cover w-2/3 h-52 -mb-28 mr-8 z-10"
                />
                <div className={` flex flex-col items-start bg-gray-950/70 pt-2 pb-6 text-white relative`}>
                  <Link href="/share" title="share" className="bg-fuchsia-400 p-2 absolute -top-3 right-2 z-30"><Image src="/images/share-btn.svg" width="68" height="54" className="w-6 h-auto" alt=""/></Link>
                  <h3 className="font-bold text-fuchsia-400 text-4xl pb-2 pl-3 w-auto">
                    {`
                      ${
                        new Date(event.start_date)
                          .toLocaleTimeString()
                          .split(":")[0]
                      }PM
                        `}
                  </h3>
                  <h3 className="z-30 bg-fuchsia-400 text-xl p-1 mb-10 pr-4 italic">{event.location.name}</h3>
                  <button onClick={() => eventHandler(event)}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 42,
                        lineHeight: "48px",
                        maxHeight: 98,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textTransform: "capitalize",
                      }}
                    >
                      {event.name.toLowerCase()}
                    </h2>
                    <p
                      style={{
                        margin: "12px 0",
                        maxHeight: 100,
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </p>
                  </button>
                </div>
                <div>
                  <SocialLinks event={event} />
                </div>
              </div>
            ))}
          </div>
          {/* <Footer /> */}
        </section>

        <section className="w-full lg:w-1/2" style={{ height: "50vh" }}>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={10}
              center={center}
              onLoad={(map) => setMap(map)}
            >
              {selectedEvents.map((event, index) => (
                <MarkerF
                  key={index}
                  onClick={() => markerClickHandler(event)}
                  icon={index === 0 ? '/images/marker-selected.webp' : '/images/marker.webp'}
                  position={{
                    lat: event.location.lat,
                    lng: event.location.lng,
                  }}
                />
              ))}
            </GoogleMap>
          )}
        </section>
      </main>
    </>
  );
}
