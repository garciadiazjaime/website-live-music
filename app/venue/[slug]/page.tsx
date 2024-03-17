import List from "./list";
import { getData } from "./support";
import { chicago as tokens } from "@/support/token";
import { LocationChart } from "@/support/types";

import styles from "./page.module.css";

async function getLocations() {
  const res = await fetch(process.env.NEXT_PUBLIC_LOCATION_URL!);

  if (!res.ok) {
    return;
  }

  return res.json();
}

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map((item: LocationChart) => ({
    slug: item.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const locations = await getLocations().catch(() => []);
  const { venue, neighbors } = getData(locations, params.slug);

  if (!venue) {
    return <div>:( error</div>;
  }

  return (
    <main
      className={styles.main}
      style={{
        fontSize: 40,
        padding: 12,
        backgroundColor: "#172554",
        width: "100vw",
        height: "100vh",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <section>
        <div>
          Hi{" "}
          <h1
            style={{
              display: "inline",
              fontWeight: "bold",
              color: tokens.color.blue,
            }}
          >
            {params.slug}
          </h1>
          ,
        </div>
        <p style={{ padding: "12px 0" }}>
          It looks you have{" "}
          <strong style={{ color: tokens.color.blue }}>
            {venue.events} Events this month
          </strong>
          .
        </p>

        <List neighbors={neighbors} />
      </section>
    </main>
  );
}
