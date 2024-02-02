import Image from "next/image";
import Link from "next/link";
import { Event } from "../../support/types";
import SocialLinks from "../socialLinks";

interface Props {
  event: Event;
  index: number;
  selected: boolean | undefined;
  setPin: () => void;
}

const EventCard = ({ event, index, selected = false, setPin }: Props) => {
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

  const gotoEventPage = (event: Event) => window.open(event.url, "_blank");

  return <div className="flex flex-col w-full h-full items-end group">
    <Image
      priority={index === 0}
      src={getImage(event)}
      width={300}
      height={150}
      alt={event.name}
      className="object-cover w-3/4 h-32 -mb-24 mr-4 z-10 bg-white"
    />
    <div className={`flex flex-col w-full items-start grow ${selected ? 'bg-fuchsia-800/50 shadow-xl' : 'bg-gray-950/40 group-hover:bg-fuchsia-800/30'} py-2 mr-2 text-white relative `}>
      <div className={`absolute bottom-2 -right-2 z-30 w-auto gap-2 flex flex-col ${!selected && 'lg:opacity-0 group-hover:opacity-100 transition-all duration-300'}`}>
        <button onClick={setPin} className={`bg-fuchsia-400 p-2 flex ${selected && 'hidden'}`}>
          <Image src="/images/pin.svg" width="68" height="54" className="w-5 h-auto" alt=""/>
        </button>
        <button className="bg-fuchsia-400 p-2 flex">
          <Image src="/images/share-btn.svg" width="68" height="54" className="w-5 h-auto" alt=""/>
        </button>
        <button className="bg-fuchsia-400 p-2 flex">
          <Image src="/images/show-location.svg" width="68" height="54" className="w-5 h-auto" alt=""/>
        </button>
        <button onClick={() => gotoEventPage(event)} className="bg-fuchsia-400 p-2 flex">
          <Image src="/images/tickets.svg" width="68" height="54" className="w-5 h-auto" alt=""/>
        </button>
      </div>
      <h3 className="font-bold text-fuchsia-400 text-3xl pb-2 pl-3 w-auto">
        {`
          ${
            new Date(event.start_date)
              .toLocaleTimeString()
              .split(":")[0]
          }
            `}<span className="text-base">PM</span>
      </h3>
      <h3 className="z-30 bg-fuchsia-400 text-base mb-10 px-3 italic">{event.location.name}</h3>
      <h2 className="capitalize  text-left text-2xl font-bold text-elipsis px-6 w-full">
        {event.name.toLowerCase()}
      </h2>
      <div className={`flex pl-2 ${!selected && 'lg:opacity-0 group-hover:opacity-100 transition-all duration-300'}`}>
        <SocialLinks event={event} />
      </div>
    </div>
  </div>
}

export default EventCard;
