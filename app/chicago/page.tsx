import Link from "next/link";

import { Event } from "../../support/types";
import events from "../../public/events.json";

export default function Home() {
  const genresSummary = events.reduce(
    (accumulator: { [key: string]: number }, event: Event) => {
      event.artists?.map((artist) => {
        artist.metadata?.spotify?.genres?.forEach((genre) => {
          console.log(genre);
          const key = genre.name;
          if (!accumulator[key]) {
            accumulator[key] = 0;
          }

          accumulator[key] += 1;
        });
      });

      return accumulator;
    },
    {}
  );
  const genres = Object.keys(genresSummary)
    .map((genre) => {
      return [genre, genresSummary[genre]];
    })
    .sort((a, b) => (b[1] as number) - (a[1] as number));
  console.log(genres);

  return (
    <div>
      <div>
        <Link href="/chicago/events">View All Events</Link>
      </div>
      <div>
        {events.map((event) => (
          <div>{event.name}</div>
        ))}
      </div>
    </div>
  );
}
