import Container from "./container";
import { Event } from "@/support/types";
import { getEventWithDateAndTime } from "./support";

async function getEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_S3_URL!}/public/events.json`
  );

  if (!res.ok) {
    return;
  }

  const events = await res.json();
  const today = new Date();

  console.log({ today, total: events.length });

  return events
    .filter(
      (event: Event) => new Date(event.start_date).getDate() === today.getDate()
    )
    .slice(0, 10)
    .map(getEventWithDateAndTime);
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDaysOfWeek = () => {
  const response = ["Today"];

  const today = new Date().getDay();
  const SUNDAY = 0;
  if (today === SUNDAY) {
    return response;
  }

  return [...response, ...DAYS.slice(today)];
};

const Home = async () => {
  const events = await getEvents().catch((error) => {
    console.log(error);
    return [];
  });

  const daysOfWeek = getDaysOfWeek();
  console.log({ daysOfWeek, total: events.length });
  if (!events.length) {
    return <div>:( no events</div>;
  }

  return (
    <div
      date-date={new Date().toLocaleString()}
      data-time={new Date().toTimeString()}
    >
      <Container events={events} daysOfWeek={daysOfWeek} />
    </div>
  );
};

export default Home;
