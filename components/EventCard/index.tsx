import Image from "next/image";
import Link from "next/link";
import { Event } from "../../support/types";
import SocialLinks from "../socialLinks";

interface Props {
  event: Event;
  index: number;
  selected: boolean | undefined;
}

const EventCard = ({ event, index, selected = false }: Props) => {
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

  return <div className="flex flex-col w-full h-full items-end">
    <Image
      priority={index === 0}
      src={getImage(event)}
      width={300}
      height={150}
      alt={event.name}
      className="object-cover w-2/3 h-32 -mb-24 mr-8 z-10 bg-white"
    />
    <div className={`flex flex-col w-full items-start grow ${selected ? 'bg-fuchsia-800/30 shadow-xl' : 'bg-gray-950/40'} pt-2 pb-6 text-white relative `}>
      <div className="absolute -top-3 right-2 z-30 w-auto">
        <Link href="/share" className="bg-fuchsia-400 p-1.5 mb-2 flex">
          <Image src="/images/share-btn.svg" width="68" height="54" className="w-5 h-auto" alt=""/>
        </Link>
        <button className="bg-fuchsia-400 p-1.5 flex">
          <Image src="/images/show-location.svg" width="68" height="54" className="w-5 h-auto" alt=""/>
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
      <button onClick={() => eventHandler(event)} className="text-left font-bold text-elipsis text-4xl px-6 flex justify-between items-center w-full gap-4">
        <h2 className="capitalize  text-left text-2xl">
          {event.name.toLowerCase()}
        </h2>
        <Image src="/images/chevron.svg" width="22" height="56" className="w-4 h-auto" alt=""/>
      </button>
      <div className="flex pl-2">
        <SocialLinks event={event} />
      </div>
    </div>
  </div>
}

export default EventCard;
