import Container from "./container";
import { Event } from "@/support/types";
import { getEventWithDateAndTime } from "./support";

async function getEvents() {
  const url = `${process.env.NEXT_PUBLIC_S3_URL!}/public/events.json`;
  console.log({ url });
  const res = await fetch(url);

  if (!res.ok) {
    return;
  }

  const data = await res.json();
  console.log({ created: data.created, total: data.events?.length });
  const today = new Date();

  return data.events
    .filter(
      (event: Event) => new Date(event.start_date).getDate() === today.getDate()
    )
    .sort(
      (a: Event, b: Event) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
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
  const events = await getEvents().catch(() => []);

  const daysOfWeek = getDaysOfWeek();

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
