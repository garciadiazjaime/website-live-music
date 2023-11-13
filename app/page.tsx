"use client";

import { useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

import TagManager from "react-gtm-module";
import Image from "next/image";
import styles from "./page.module.css";
import events from "../public/events.json";

const tagManagerArgs = {
  gtmId: "GTM-5TDDZW8S",
};

interface Event {
  name: string;
  image: string;
  description: string;
  url: string;
  start_date: string;
  location: {
    name: string;
    gmaps: {
      lat: number;
      lng: number;
      name: string;
    };
  };
}

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

export default function Home() {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const center = {
    lat: 41.8777569,
    lng: -87.6271142,
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const markerClickHandler = (event: Event) => {
    const element = document.getElementById(slugify(event.name));
    element?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <main>
      <div
        style={{
          height: "50vh",
          width: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1,
          background: "white",
        }}
      >
        <h1 style={{ padding: 12, borderBottom: "1px solid #000" }}>
          Chicago Live Music
        </h1>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={10}
            center={center}
          >
            {events.map((event, index) => (
              <MarkerF
                key={index}
                onClick={() => markerClickHandler(event)}
                position={{
                  lat: event.location.gmaps.lat,
                  lng: event.location.gmaps.lng,
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>

      <section style={{ margin: "54vh 0 20px" }}>
        <h2 style={{ margin: "0 0 20px 0" }}>Event List</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {events.map((event, index) => (
            <div
              key={index}
              style={{ position: "relative", borderTop: "1px solid black" }}
              className={styles.card}
              id={slugify(event.name)}
            >
              <h3
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: "6px 0",
                }}
                className={styles.title}
              >
                {event.name}
              </h3>
              <Image
                src={event.image!}
                width={300}
                height={300}
                alt={event.name}
                style={{
                  objectFit: "cover",
                  width: "100%",
                }}
              />
              <p
                style={{
                  margin: "12px 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                className={styles.description}
              >
                {event.description}
              </p>
              <p style={{ opacity: 0.8 }}>
                {new Date(event.start_date).toDateString()}
              </p>
              <p
                style={{
                  margin: "12px 0",
                  opacity: 0.8,
                }}
              >
                {event.location.name}
              </p>
              <a
                href={event.url}
                target="_blank"
                rel="nofollow"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          ))}
        </div>
      </section>

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
    </main>
  );
}
