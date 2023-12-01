"use client";
import RGBKineticSliderComponent from "@/components/RGBKineticSliderComponent";
import events from "../../public/events.json";

const eFlyer = () => {
  const top5 = events.slice(0,5);
  const images = top5.map(event => event.image);
  const texts = top5.map(event => [event.artist.name, event.location.name]);

  return <div>
    <h1 className="text-3xl font-bold text-center bg-red-500 text-white py-6">eFlyer recorder</h1>
    <RGBKineticSliderComponent images={images} texts={texts} />
  </div>
}
export default eFlyer;
