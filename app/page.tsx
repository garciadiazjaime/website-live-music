"use client";

import TagManager from "react-gtm-module";
import events from "../public/events.json";

import { useEffect } from "react";

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
      <section style={{ margin: "20px 0", padding: "0 12px" }}>
        {events.map((event, index) => (
          <div key={index} style={{ margin: "20px 0", position: "relative" }}>
            <h2>{event.title}</h2>
            <div style={{ height: 200, width: 200, backgroundColor: "#CCC" }} />
            <p>{event.category}</p>
            <p>{event.schedule}</p>
            <p>{event.venue}</p>

            <a
              href={event.event_url}
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
