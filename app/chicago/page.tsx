"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import genres from "../../public/genre_summary.json";

const OPACITY_LOW = 0.3;

export default function Home() {
  const [options, setOptions] = useState(genres.artists.sort);
  const [history, setHistory] = useState<string[]>([]);
  const [option, setOption] = useState("");
  const [optionA, setOptionA] = useState<string>(
    genres.parent.sort[0][0] as string
  );
  const [optionB, setOptionB] = useState<string>(
    genres.parent.sort[1][0] as string
  );
  const [index, setIndex] = useState(2);

  const chooseHandler = (selected: string) => {
    if (index >= genres.parent.sort.length) {
      return;
    }

    if (selected === "A") {
      setOption(optionA);
      const _history = [...history, optionB];
      setHistory(_history);
      setOptionB(genres.parent.sort[index][0] as string);

      const _options = options
        .map((option) => ({
          ...option,
          disabled: !!option.genres.parents.find((parent) =>
            _history.includes(parent)
          ),
        }))
        .sort((a, b) => (a.disabled as any) - (b.disabled as any));

      setOptions(_options);
    } else if (selected === "B") {
      setOption(optionB);
      const _history = [...history, optionA];
      setHistory(_history);
      setOptionA(genres.parent.sort[index][0] as string);

      const _options = options
        .map((option) => ({
          ...option,
          disabled: !!option.genres.parents.find((parent) =>
            _history.includes(parent)
          ),
        }))
        .sort((a, b) => (a.disabled as any) - (b.disabled as any));

      setOptions(_options);
    }

    setIndex(index + 1);

    setInterval(() => {
      setOption("");
    }, 1_000);
  };

  const getOpacity = (disabled: boolean) => {
    if (disabled) {
      return OPACITY_LOW;
    }

    return 1;
  };

  return (
    <div>
      <div>
        <Link href="/chicago/events">View All Events</Link>
      </div>

      <h2 style={{ fontSize: 42 }}>What do you prefer?</h2>
      <div style={{ display: "flex", fontSize: 24 }}>
        <button
          onClick={() => chooseHandler("A")}
          style={{
            border: "1px solid black",
            flex: 1,
            padding: 20,
            backgroundColor: option === optionA ? "#CCC" : "",
          }}
        >
          {optionA}
        </button>
        <div style={{ margin: 40 }}>OR</div>
        <button
          onClick={() => chooseHandler("B")}
          style={{
            border: "1px solid black",
            flex: 1,
            padding: 20,
            backgroundColor: option === optionB ? "#CCC" : "",
          }}
        >
          {optionB}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        {options.map((artist) => (
          <Image
            data-pk={artist.pk}
            key={artist.pk}
            style={{
              backgroundColor: "black",
              borderRadius: "50%",
              height: 48,
              width: 48,
              margin: 20,
              opacity: getOpacity(artist.disabled),
              cursor: "pointer",
            }}
            src={artist.image}
            width={40}
            height={40}
            alt={artist.name}
          />
        ))}
      </div>
    </div>
  );
}
