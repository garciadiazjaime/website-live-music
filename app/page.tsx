import Head from "next/head";

import Container from "./container";
import { Event } from "@/support/types";
import { getEventWithDateAndTime } from "./support";

async function getEvents() {
  const url = `${process.env.NEXT_PUBLIC_S3_URL!}/public/events.json`;

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
      <Head>
        <title>Chicago Music Compass | Live Music Events in Chicago</title>
        <meta
          property="og:title"
          content="Chicago Music Compass | Live Music Events in Chicago"
        />
        <meta
          property="og:description"
          content="Welcome to Chicago Music Compass! We're not just another tech team – we're music enthusiasts, bandmates, and tech wizards on a mission to shake up the Windy City's live music scene"
        />
        <meta
          property="og:url"
          content="https://www.chicagomusiccompass.com/"
        />
        <meta
          property="og:image"
          content="https://www.chicagomusiccompass.com/social/FB-Cover.jpg"
        />
      </Head>
      <Container events={events} daysOfWeek={daysOfWeek} />
    </div>
  );
};

export default Home;
