import Container from "./container";

async function getEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_S3_URL!}/public/events.json`
  );

  if (!res.ok) {
    return;
  }

  return res.json();
}

const Home = async () => {
  const events = await getEvents().catch(() => []);

  if (!events.length) {
    return <div>:( no events</div>;
  }

  return <Container events={events.slice(0, 10)} />;
};

export default Home;
