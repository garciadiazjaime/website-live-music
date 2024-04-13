import Container from "./container";
import { Event } from "@/support/types";

async function getEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_S3_URL!}/public/events.json`
  );

  if (!res.ok) {
    return;
  }

  return res.json();
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

  if (!events.length) {
    return <div>:( no events</div>;
  }

  const today = new Date().toJSON().split("T")[0];
  const todayEvents = events
    .filter(
      (event: Event) =>
        new Date(event.start_date).toJSON().split("T")[0] === today
    )
    .slice(0, 10);

  return <Container events={todayEvents} daysOfWeek={daysOfWeek} />;
};

export default Home;
