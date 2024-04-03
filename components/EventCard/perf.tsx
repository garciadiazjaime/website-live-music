import Image from "next/image";
import { Event } from "../../support/types";
import SocialLinks from "../socialLinks";
import ShareDialog from "../ShareDialog/perf";
import { useState } from "react";
import { Chevron, Close, Directions, Pin, PinActive, Share } from "../svgs";
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
    <article>
      <div className="header">
        <div className="time">
          {`
            ${new Date(event.start_date).toLocaleTimeString().split(":")[0]}
          `}
          <span>PM</span>
        </div>
        <strong className="venue">
          {event.location.name}
        </strong>
        <div className="imageContainer">
          <Image
            src={getImage(event)}
            height={0}
            width={0}
            alt={event.name}
          />
          <Image
            src={getImage(event)}
            height={0}
            width={0}
            alt={event.name}
          />
          <Image
            src={getImage(event)}
            height={0}
            width={0}
            alt={event.name}
          />
        </div>
       <div
          className="actions"
        >
          <button
            onClick={() => console.log('go to map with slug')}
            className="pin"
            aria-label={`pin for ${event.name}`}
          >
            <div className="actionIcon">
              <PinActive />
            </div>
          </button>
          <div
            className="actionBtn"
            onClick={() => setOpenShareDialog(!openShareDialog)}
          >
            <div className="actionIcon">
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
            <div className="actionIcon">
              <Directions />
            </div>
          </button>
        </div>
      </div>
      <div
        className="body"
      >
        <button className="eventLink" onClick={() => gotoEventPage(event)}>
          <h2>
            <span className="line-clamp">{event.name.toLowerCase()}</span>
            <div className="eventLinkIcon">
              <Chevron />
            </div>
          </h2>
        </button>
       <div
          className="socialContainer"
        >
          <SocialLinks event={event} />
        </div>
      </div>
      <style jsx>{`
        button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          border-radius: 0;
        }
        article {
          display: flex;
          color: white;
          font-family: sans-serif;
          position: relative;
          flex-direction: column;
          width: 100%;
          height: 100%;
          align-items: flex-end;
          background-image: linear-gradient(180deg, rgba(23, 37, 84, 0.2), rgba(67, 20, 7, 0.2));
          .header {
            display: flex;
            gap: 0;
            width: 100%;
            position: relative;

            .time {
              display: flex;
              align-items: flex-end;
              font-weight: bold;
              color: rgb(125 211 252);
              font-size: 2rem;
              padding: 0 16px 10px;
              margin: 0 0 20px 0;
              span {
                font-size: 1rem;
              }
            }
            .venue {
              position: absolute;
              left: 0;
              bottom: 0;
              color: white;
              z-index: 30;
              background-color: rgb(225 29 72);
              font-size: 1rem;
              margin-bottom: 16px;
              padding: 0 8px;
              font-style: italic;
            }
            .imageContainer {
              display: flex;
              overflow: hidden;
              width: 100%;
              justify-content: center;
              img {
                height: 128px;
                width: auto;
              }
            }
            .actions {
              width: 40px;
              height: 120px;
              display: flex;
              flex-direction: column;
              transition-property: all;
              transition-duration: 300ms;
              .actionIcon {
                width: 20px;
              }
              .pin {
                display: flex;
                justify-content: center;
                flex-grow: 1;
                align-items: center;
                background-color: rgb(225 29 72);
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
            }
          }
          .body {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: stretch;
            flex-grow: 1;
            color: white;
            position: relative;
            .eventLink {
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
              .eventLinkIcon {
                width: 20px;
                margin-left: 16px;
                flex-shrink: 0;
              }
            }
            .socialContainer {
              display: flex;
              transition-property: all;
              transition-duration: 300mx;
            }
          }
        }
      `}</style>
    </article>
  );
};

export default EventCard;
