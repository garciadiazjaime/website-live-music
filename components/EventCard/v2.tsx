"use client";

import Image from "next/image";
import { Event } from "../../support/types";
import SocialLinks from "../socialLinks";
import ShareDialog from "../ShareDialog/perf";
import { useState } from "react";
import { Chevron, Close, Directions, PinActive, Share } from "../svgs";
import { tokens } from "@/support/token";

interface Props {
  event: Event;
}

const doHTTPS = (url: string) => url?.replace("http:", "https:");

const DateTime = ({ time }: { time: string }) => {
  const value = parseInt(time);
  const hour = value % 12;
  const meridiem = value > 12 ? "PM" : "AM";
  return (
    <>
      {hour} <span style={{ fontSize: "1rem" }}>{meridiem}</span>
    </>
  );
};

const EventCard = ({ event }: Props) => {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const getImage = (event: Event): string => {
    const artist = event.artists?.find((artist) => artist.metadata?.image);
    if (artist) {
      return doHTTPS(artist.metadata?.image || "");
    }

    if (event.location?.metadata?.image) {
      return doHTTPS(event.location.metadata.image);
    }

    return doHTTPS(event.image);
  };

  const directionsClickHandler = (event: Event) => {
    window.open(event.location.url, "_blank");
  };

  const gotoEventPage = (event: Event) => window.open(event.url, "_blank");

  return (
    <article
      style={{
        display: "flex",
        color: "white",
        fontFamily: "sans-serif",
        position: "relative",
        flexDirection: "column",
        width: "100%",
        backgroundImage:
          "linear-gradient(90deg, rgba(23, 37, 84), rgba(67, 20, 7, 1))",
      }}
      data-date={event.start_date}
    >
      <div
        style={{
          display: "flex",
          gap: 0,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontWeight: "bold",
            color: "rgb(125 211 252)",
            fontSize: "2rem",
            padding: "0 16px 20px",
            margin: "0 0 20px 0",
          }}
        >
          <DateTime time={event.time} />
        </div>
        <strong
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            color: "white",
            zIndex: 30,
            backgroundColor: "rgb(225 29 72)",
            fontSize: "1rem",
            marginBottom: 16,
            padding: "0 8px",
            fontStyle: "italic",
            flexShrink: 0,
          }}
        >
          {event.location.name}
        </strong>
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Image src={getImage(event)} height={0} width={0} alt={event.name} />
          <Image src={getImage(event)} height={0} width={0} alt={event.name} />
          <Image src={getImage(event)} height={0} width={0} alt={event.name} />
        </div>
        <div
          style={{
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            transitionProperty: "all",
            transitionDuration: "300ms",
            flexShrink: 0,
          }}
        >
          <div
            className="actionBtn"
            onClick={() => setOpenShareDialog(!openShareDialog)}
          >
            <div style={{ width: 15, padding: 15, display: "flex" }}>
              {openShareDialog ? <Close /> : <Share />}
            </div>
            <ShareDialog
              url={`https://livemusic.mintitmedia.com/chicago/events#${event.slug}`}
              open={openShareDialog}
              setOpen={setOpenShareDialog}
            />
          </div>
          <button
            onClick={() => directionsClickHandler(event)}
            className="actionBtn"
            aria-label={`google maps link for ${event.name}`}
          >
            <div style={{ width: 15, padding: 15, display: "flex" }}>
              <Directions />
            </div>
          </button>
        </div>
      </div>
      <div
        className="body"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "stretch",
          flexGrow: 1,
          color: "white",
          position: "relative",
        }}
      >
        <button className="eventLink" onClick={() => gotoEventPage(event)}>
          <h2
            style={{
              cursor: "pointer",
              color: tokens.color.white,
              textTransform: "capitalize",
              textAlign: "left",
              padding: "20px 18px 20px 16px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textOverflow: "ellipsis",
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 80,
            }}
          >
            <span
              style={{
                textOverflow: "hidden",
              }}
            >
              {event.name.toLowerCase()}
            </span>
            <div
              style={{
                width: 35,
                marginLeft: 16,
                flexShrink: 0,
              }}
            >
              <Chevron />
            </div>
          </h2>
        </button>
        <div
          style={{
            display: "flex",
            transitionProperty: "all",
            transitionDuration: "300mx",
          }}
        >
          <SocialLinks event={event} />
        </div>
      </div>

      <style jsx>{`
        article {
          button {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            border-radius: 0;
          }

          img {
            height: 128px;
            width: auto;
          }

          .actionBtn {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.6;
            position: relative;
            cursor: pointer;

            &:hover {
              opacity: 1;
            }
          }

          h2 {
            @media (min-width: ${tokens.breakpoints.lg}) {
              opacity: 0.8;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      `}</style>
    </article>
  );
};

export default EventCard;
