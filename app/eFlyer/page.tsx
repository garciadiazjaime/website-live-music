"use client";
import RGBKineticSliderComponent, {startRecording} from "@/components/RGBKineticSliderComponent";
import events from "../../public/events.json";
import SegmentedWheel from "@/components/SegmentedWheel";
import MusicRecord from "@/components/MusicRecord";

const EFlyer = () => {

  const top5 = events.slice(0, 5);
  const images = top5.map((event) => event.image);
  const texts = top5.map((event) => [event.name, event.location.name]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center bg-black text-white py-6 flex flex-row gap-6 justify-center items-center">
        eFlyer recorder
        <button onClick={startRecording} id="playSlider" className="bg-white text-red-500 rounded-md p-4 ml-4 hover:scale-105 transition-all">Create video</button>
        <SegmentedWheel numberOfSegments={7} innerRadius={30} />
        <MusicRecord numberOfCircles={10} />
      </h1>
      <RGBKineticSliderComponent images={images} texts={texts} />
    </div>
  );
};
export default EFlyer;
