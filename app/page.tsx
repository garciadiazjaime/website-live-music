"use client";
import { useEffect } from "react";

import TagManager from "react-gtm-module";
import Image from "next/image";
import events from "../public/events.json";
import styles from "./page.module.css";

const tagManagerArgs = {
  gtmId: "GTM-5TDDZW8S",
};

export default function Home() {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <main>
      <h1 style={{ padding: 12, borderBottom: "1px solid #000" }}>
        Chicago Live Music
      </h1>
      <hr />
      <section style={{ margin: "20px 0", padding: "0 12px" }}>
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
                {new Date(event.startDate).toDateString()}
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
