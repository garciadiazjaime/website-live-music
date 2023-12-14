"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

import TagManager from "react-gtm-module";
import Image from "next/image";

import SocialLinks from "../components/socialLinks";
import events from "../public/events.json";
import { Event } from "../support/types";
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
    <div>
      <header
        style={{
          height: 70,
          borderBottom: "1px solid #000",
          position: "fixed",
          left: 0,
          top: 0,
          background: "white",
          width: "100%",
          zIndex: 1,
          display: "flex",
        }}
      >
        <h1 style={{ padding: 12, fontSize: 36 }}>
          Chicago <span className={styles.h1}>Live Music</span>
        </h1>
        <select
          style={{
            marginLeft: 20,
            fontSize: 32,
            border: "none",
            borderBottom: "5px dotted #CCC",
            color: "black",
          }}
          defaultValue={currentDay}
          onChange={dateHandler}
        >
          {days.map((day, index) => (
            <option value={index} key={day} disabled={index < currentDay}>
              {currentDay === index ? "Today" : day}
            </option>
          ))}
        </select>
      </header>

      <main
        style={{
          height: "100%",
        }}
      >
        <section style={{ width: "50%", padding: 12, marginTop: 70 }}>
          <h2 style={{ margin: "0 0 30px 0", fontSize: 30 }}>
            {selectedEvents.length} Events
          </h2>
          <div>
            {selectedEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  margin: "70px 0",
                  display: "flex",
                  border: "1px dashed #000",
                }}
                id={getEventID(event)}
              >
                <Image
                  priority={index === 0}
                  src={getImage(event)}
                  width={300}
                  height={150}
                  alt={event.name}
                  style={{
                    backgroundColor: "#333",
                    objectFit: "cover",
                    width: 300,
                    height: 300,
                    flex: 1,
                  }}
                />
                <div
                  style={{
                    borderRight:
                      selectedEvent?.pk === event.pk ? "6px dashed red" : "",
                    flex: 1,
                    padding: "0 12px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      opacity: 0.8,
                      fontSize: 20,
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ maxWidth: "75%" }}>{event.location.name}</div>
                    <div>
                      {`${
                        new Date(event.start_date)
                          .toLocaleDateString()
                          .split("/20")[0]
                      }
                        ${
                          new Date(event.start_date)
                            .toLocaleTimeString()
                            .split(":")[0]
                        }PM
                          `}
                    </div>
                  </div>
                  <h3
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
                  </h3>
                  <p
                    style={{
                      margin: "12px 0",
                      maxHeight: 100,
                      overflow: "hidden",
                    }}
                  >
                    {event.description}
                  </p>
                  <div
                    onClick={() => eventHandler(event)}
                    style={{
                      marginTop: "auto",
                      fontSize: 30,

                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginTop: "auto",
                        marginBottom: 6,
                        flex: 1,
                      }}
                    >
                      <SocialLinks event={event} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        cursor: "pointer",
                        textDecoration: "underline",
                        textAlign: "right",
                      }}
                    >
                      See More
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <footer
            style={{
              borderTop: "1px solid #000",
              padding: "20px 12px",
            }}
          >
            Follow us on: <br />
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                margin: 0,
                padding: "12px 0 0",
                justifyContent: "space-between",
              }}
            >
              <li>
                <a
                  href="https://www.tiktok.com/@livemusic210"
                  rel="nofollow"
                  style={{ textDecoration: "underline" }}
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/people/Playami-Town/pfbid0km55nti3TSQbd1Nu1FoiDREZfpu1adEG3CAzzVaKAuw4SLZoz7vKwUAZ2UZyEejjl/"
                  rel="nofollow"
                  style={{ textDecoration: "underline" }}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/playamitown/"
                  rel="nofollow"
                  style={{ textDecoration: "underline" }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/livemusic210"
                  rel="nofollow"
                  style={{ textDecoration: "underline" }}
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCWJE0M7LgZjKBvvceSmSEBw"
                  rel="nofollow"
                  style={{ textDecoration: "underline" }}
                >
                  Youtube
                </a>
              </li>
            </ul>
          </footer>
        </section>

        <section
          style={{
            height: "calc(100vh - 70px)",
            width: "50%",
            position: "fixed",
            top: 70,
            right: 0,
            background: "white",
          }}
        >
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
    </div>
  );
}
