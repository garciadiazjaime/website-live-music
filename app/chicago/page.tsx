"use client";

import Link from "next/link";

import { Artist } from "../../support/types";
import artists from "../../public/artist_metadata.json";
console.log(artists);
export default function Home() {
  const genresSummary = artists.reduce(
    (accumulator: { [key: string]: number }, artist: Artist) => {
      artist.metadata?.spotify?.genres?.forEach((genre) => {
        const key = genre.name;
        if (!accumulator[key]) {
          accumulator[key] = 0;
        }

        accumulator[key] += 1;
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

  const chooseHandler = (option: boolean) => {
    console.log("chooseHandler", option);
  };
  console.log(genres);

  return (
    <div>
      <div>
        <Link href="/chicago/events">View All Events</Link>
      </div>

      <h2 style={{ fontSize: 42 }}>What do you prefer?</h2>
      <div style={{ display: "flex", fontSize: 24 }}>
        <button
          onClick={() => chooseHandler(true)}
          style={{ border: "1px solid black", flex: 1, padding: 20 }}
        >
          {genres[0][0]}
        </button>
        <div style={{ margin: 40 }}>OR</div>
        <button
          onClick={() => chooseHandler(false)}
          style={{ border: "1px solid black", flex: 1, padding: 20 }}
        >
          {genres[genres.length - 1][0]}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        {artists.map((artist) => (
          <div
            key={artist.pk}
            style={{
              backgroundColor: "black",
              borderRadius: "50%",
              height: 48,
              width: 48,
              margin: 20,
            }}
          />
        ))}
      </div>
    </div>
  );
}
