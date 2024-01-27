import Image from "next/image";

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
  return <header className="text-fuchsia-500 bg-gradient-to-r from-fuchsia-950 to-gray-900 flex  justify-between">
  <div className="bg-gray-950 mb-4 md:mb-3 p-1 md:p-2 pr-36">
    <h1 className="flex items-center uppercase text-2xl md:text-3xl font-black gap-2">
      <Image src="/images/logo.svg" width="117" height="116" className="h-auto w-12 md:w-20 -mb-4 md:-mb-3" alt="Live Music" /> Chicago
    </h1>
  </div>
  <select
    className="mt-4 md:mt-6 -ml-16 bg-fuchsia-500 text-gray-950 italic font-semibold px-4 text-xl md:text-2xl rounded-none lg:hidden"
    defaultValue={currentDay}
    onChange={dateHandler}
  >
    {days.map((day, index) => (
      <option value={index} key={day} disabled={index < currentDay}>
        {currentDay === index ? "Today" : day}
      </option>
    ))}
  </select>
</header>
}
export default Header;
