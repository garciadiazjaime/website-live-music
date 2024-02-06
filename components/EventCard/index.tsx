import Image from "next/image";
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
      return artist.metadata?.image || '';
    }

    if (event.location?.metadata?.image) {
      return event.location.metadata.image;
    }

    return event.image;
  };

  const gotoEventPage = (event: Event) => window.open(event.url, "_blank");
  return <div className={`flex flex-col w-full h-full items-end group ${selected ? 'bg-blue-500/20 shadow-xl' : 'group-hover:bg-blue-500/20 bg-gradient-to-t from-blue-500/20 to-transparent'}`}>
    <div className="flex gap-0 relative items-end w-full">
      <h3 className="flex items-end font-bold text-sky-300  text-3xl pb-2 px-4 mb-10">
        {`
          ${
            new Date(event.start_date)
              .toLocaleTimeString()
              .split(":")[0]
          }
            `}<span className="text-base">PM</span>
      </h3>
      <h3 className="absolute left-0 bottom-0 text-white z-30 bg-rose-600 text-base mb-4 px-4 italic">{event.location.name}</h3>
      <div className="h-32 w-full grow bg-contain bg-white/50 bg-center" style={{ backgroundImage: `url(${getImage(event)})`}}></div>
      <div className={`w-10 flex flex-col transition-all duration-300'`}>
        <button onClick={setPin} className={`p-2 flex justify-center ${selected ? 'bg-rose-600' : 'bg-sky-300/60 hover:bg-sky-300'}`}>
          <Image src={`${selected ? '/images/pin-active.svg' : '/images/pin.svg'}`} width="68" height="54" className="w-3 h-auto" alt=""/>
        </button>
        <button className={`p-2 flex  justify-center ${selected ? 'lg:opacity-60 lg:hover:opacity-100' : 'lg:opacity-20'}`}>
          <Image src="/images/share.svg" width="68" height="54" className="w-3 h-auto" alt=""/>
        </button>
        <button onClick={() => gotoEventPage(event)} className={`p-2 flex justify-center ${selected ? 'lg:opacity-60 lg:hover:opacity-100' : 'lg:opacity-20'}`}>
          <Image src="/images/directions.svg" width="68" height="54" className={`w-3 h-auto`} alt=""/>
        </button>
      </div>
    </div>
    <div className={`flex flex-col w-full items-stretch grow text-white relative`}>
      <h2 className="capitalize text-left p-4 pb-0 pr-8 text-2xl font-bold text-overflow-elipsis flex justify-between items-center">
        {event.name.toLowerCase()}
        <Image src="/images/chevron.svg" width="60" height="65" alt="" className="w-8 h-auto ml-4" />
      </h2>
      <div className={`flex ${!selected && 'lg:opacity-20 group-hover:opacity-100 transition-all duration-300'}`}>
        <SocialLinks event={event} />
      </div>
    </div>
  </div>
}

export default EventCard;
