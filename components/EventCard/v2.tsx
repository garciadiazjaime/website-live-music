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

const EventCard = ({ event }: Props) => {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const getImage = (event: Event): string => {
    const artist = event.artists?.find((artist) => artist.metadata?.image);
    if (artist) {
      return artist.metadata?.image || "";
    }

    if (event.location?.metadata?.image) {
      return event.location.metadata.image;
    }

    return event.image;
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
        height: "100%",
        alignItems: "flex-end",
        backgroundImage:
          "linear-gradient(180deg, rgba(23, 37, 84, 0.2), rgba(67, 20, 7, 0.2))",
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
            padding: "0 16px 10px",
            margin: "0 0 20px 0",
          }}
        >
          {new Date(event.start_date).toLocaleTimeString().split(":")[0]}
          <span style={{ fontSize: "1rem" }}>PM</span>
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
            width: 40,
            height: 120,
            display: "flex",
            flexDirection: "column",
            transitionProperty: "all",
            transitionDuration: "300ms",
          }}
        >
          <button
            onClick={() => console.log("go to map with slug")}
            style={{
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
              alignItems: "center",
              backgroundColor: "rgb(225 29 72)",
            }}
            aria-label={`pin for ${event.name}`}
          >
            <div style={{ width: 20 }}>
              <PinActive />
            </div>
          </button>
          <div
            className="actionBtn"
            onClick={() => setOpenShareDialog(!openShareDialog)}
          >
            <div style={{ width: 20 }}>
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
            <div style={{ width: 20 }}>
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
          <h2>
            <span className="line-clamp">{event.name.toLowerCase()}</span>
            <div
              style={{
                width: 20,
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
            flex-grow: 1;
            opacity: 0.6;
            position: relative;
            cursor: pointer;

            &:hover {
              opacity: 1;
            }
          }

          h2 {
            cursor: pointer;
            color: white;
            text-transform: capitalize:
            text-align: left;
            padding: 20px 18px 20px 16px;
            font-size: 1.5rem;
            font-weight: bold;
            text-overflow: ellipsis;
            display: flex;
            justify-content: space-between;
            align-items: center;

            @media (min-width: ${tokens.breakpoints.lg}) {
              opacity: 0.8;
              &:hover {
                opacity: 1;
              }
            }

            .line-clamp {
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      `}</style>
    </article>
  );
};

export default EventCard;
