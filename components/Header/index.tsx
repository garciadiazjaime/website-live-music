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
  return <header className="text-fuchsia-500 bg-gradient-to-r from-fuchsia-950 to-gray-900 flex justify-start z-50">
  <div className="bg-gray-950 mb-3 p-2 pr-36">
    <h1 className="flex items-center uppercase text-3xl font-black">
      <Image src="/images/logo.svg" width="117" height="116" className="h-auto w-20 -mb-3" alt="Live Music" /> Chicago
    </h1>
  </div>
  <select
    className="mt-8 -ml-16 bg-fuchsia-500 text-gray-950 italic font-semibold px-4 text-2xl"
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
