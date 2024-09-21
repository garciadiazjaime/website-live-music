"use client";

import Image from "next/image";

import { SocialLinksV2 as SocialLinks } from "@/components/socialLinks";
import { Event } from "@/support/types";
import { getImage, DateTime } from "./support";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px dashed white",
        position: "relative",
        minHeight: 420,
        width: "100%",
      }}
    >
      <Image
        src={getImage(event)}
        height={220}
        width={220}
        alt={event.name}
        style={{ objectFit: "cover", width: "100%" }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ padding: "6px 12px 0" }}>
          <h3
            style={{
              fontSize: 24,
              margin: 0,
              maxHeight: 70,
              overflow: "hidden",
              textTransform: "uppercase",
              wordBreak: "break-all",
            }}
          >
            {event.name.toLowerCase()}
          </h3>
          <h4
            style={{
              fontSize: 20,
              opacity: 0.8,
              margin: 0,
              textTransform: "capitalize",
            }}
          >
            {event.location.name}
          </h4>
          <div style={{ fontSize: 18 }}>
            <DateTime time={event.time} />{" "}
            {event.price && <span>/ ${event.price}</span>}
          </div>
        </div>

        <div
          style={{
            fontSize: 18,
            display: "flex",
            flexDirection: "column",
            paddingLeft: 12,
            width: "calc(100% - 140px - 36px)",
            overflow: "hidden",
          }}
        >
          <SocialLinks event={event} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
        }}
      >
        {!event.buyUrl && (
          <a
            href={event.url}
            target="_blank"
            style={{
              border: "1px solid white",
              color: "white",
              textDecoration: "none",
              fontSize: 18,
              width: 140,
              height: 42,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            event details
          </a>
        )}

        {event.buyUrl && (
          <a
            href={event.buyUrl}
            target="_blank"
            style={{
              border: "1px solid white",
              color: "white",
              textDecoration: "none",
              fontSize: 18,
              width: 140,
              height: 42,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            buy ticket
          </a>
        )}
      </div>
    </article>
  );
}
