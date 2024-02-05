import Image from "next/image";
import { useState } from "react";
import generateUniqueKey from "@/support/generateUniqueKey";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface Props {
  currentDay: number;
  dateHandler: (event: any) => void;
}

const Header = ({ currentDay, dateHandler }: Props) => {
  const [activeDay, setActiveDay] = useState(currentDay);

  const handleClick = (e: any, i: number) => {
    dateHandler(e);
    setActiveDay(i);
  }

  return <header className="">
  <div className="my-5 bg-blue-500/10 flex  justify-between pl-2">
    <h1 className="text-sky-400 flex items-center uppercase text-2xl md:text-3xl italic font-black gap-2">
      <Image src="/images/logo.svg" width="117" height="116" className="h-auto w-12 md:w-16 -mt-2 -mb-5" alt="Live Music" /> Chicago
    </h1>
    <select
      className="mt-4 md:mt-6 -ml-16 bg-fuchsia-500 text-gray-950 italic font-semibold px-4 text-xl md:text-2xl rounded-none lg:hidden"
      defaultValue={currentDay}
      onChange={dateHandler}
      >
      {days.map((day, index) => (
        <option value={index} key={generateUniqueKey(day)} disabled={index < currentDay}>
          {currentDay === index ? "Today" : day}
        </option>
      ))}
    </select>
    <div className="h-full items-end hidden lg:flex">
      {days.map((day, index) => (
        index >= currentDay && (
          <button
          className={`${activeDay === index ? 'bg-fuchsia-500 text-black' : 'bg-black text-fuchsia-500'} py-2 px-3 italic font-semibold`}
          value={index} key={generateUniqueKey(day)} onClick={(e) => handleClick(e, index)}>
          {currentDay === index ? "Today" : day}
        </button>
      )))}
    </div>
  </div>
</header>
}
export default Header;
