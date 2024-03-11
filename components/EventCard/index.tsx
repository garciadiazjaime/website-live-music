import Image from "next/image";
import { Event } from "../../support/types";
import SocialLinks from "../socialLinks";
import ShareDialog from "../ShareDialog";
import { useState, useEffect } from "react";

interface Props {
  event: Event;
  selected: boolean | undefined;
  setPin: () => void;
}

const EventCard = ({ event, selected = false, setPin }: Props) => {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [eventImage, setEventImage] = useState('/images/event-placeholder.svg');
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

  useEffect(()=> {
    setTimeout(() => {
      setEventImage(getImage(event));
    }, 2000);
  }, []);

  const gotoEventPage = (event: Event) => window.open(event.url, "_blank");

  return (
    <div
      className={`flex relative flex-col w-full h-full items-end group ${
        selected
          ? "bg-gradient-to-r  to-blue-950 from-red-950"
          : "group-hover:bg-blue-500/20 bg-gradient-to-t from-blue-500/20 to-transparent"
      }`}
    >
      {selected && (
        <div className={`absolute flex w-full h-full`}>
          <div className="border border-rose-500 w-full my-3 lg:m-1"></div>
        </div>
      )}
      <div className="flex gap-0 w-full relative">
        <h3 className="flex items-end font-bold text-sky-300  text-3xl pb-2 px-4 mb-10">
          {`
          ${new Date(event.start_date).toLocaleTimeString().split(":")[0]}
            `}
          <span className="text-base">PM</span>
        </h3>
        <h3 className="absolute left-0 bottom-0 text-white z-30 bg-rose-600 text-base mb-4 px-4 italic">
          {event.location.name}
        </h3>
        <div
          className="flex h-32 w-full grow bg-contain bg-white/50 bg-center"
          style={{ backgroundImage: `url(${eventImage})` }}
        >
        </div>
        <div
          className={`w-16 h-32 flex flex-col transition-all duration-300 ${
            !selected && "lg:opacity-20 group-hover:opacity-100"
          } `}
        >
          <button
            onClick={setPin}
            className={`flex justify-center grow items-center ${
              selected ? "bg-rose-600" : "bg-sky-300/60 hover:bg-sky-300"
            }`}
          >
            <Image
              src={`${selected ? "/images/pin-active.svg" : "/images/pin.svg"}`}
              width="68"
              height="54"
              className="w-4 h-auto"
              alt=""
            />
          </button>
          <div
            className={`flex justify-center items-center grow opacity-60 hover:opacity-100 relative cursor-pointer`}
            onClick={() => setOpenShareDialog(!openShareDialog)}
          >
            <Image
              src={`/images/${openShareDialog ? 'close' : 'share'}.svg`}
              width="68"
              height="54"
              className="w-4 h-auto"
              alt=""
            />
            <ShareDialog url={`https://livemusic.mintitmedia.com/chicago/events#${event.slug}`} open={openShareDialog} setOpen={setOpenShareDialog}/>
          </div>
          <button
            onClick={() => directionsClickHandler(event)}
            className={`flex justify-center items-center grow opacity-60 hover:opacity-100`}
          >
            <Image
              src="/images/directions.svg"
              width="68"
              height="54"
              className={`w-4 h-auto`}
              alt=""
            />
          </button>
        </div>
      </div>
      <div
        className={`flex flex-col w-full items-stretch grow text-white relative`}
      >
        <button onClick={() => gotoEventPage(event)}>
          <h2 className="cursor-pointer capitalize text-left pl-4 py-6 pb-2 pr-8 text-2xl font-bold text-overflow-elipsis flex justify-between items-center lg:opacity-80 lg:hover:opacity-100">
            <span className="line-clamp-2">{event.name.toLowerCase()}</span>
            <Image
              src="/images/chevron.svg"
              width="60"
              height="65"
              alt=""
              className="w-8 h-auto ml-4"
            />
          </h2>
        </button>
        <div
          className={`flex transition-all duration-300 ${
            !selected && "lg:opacity-20 lg:group-hover:opacity-100"
          }`}
        >
          <SocialLinks event={event} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
