"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const MODEL_URL = `${process.env.NEXT_PUBLIC_MODEL_URL!}/model.json`;

const getTwitter = async (username: string) => {
  const url = `/.netlify/functions/twitter?username=${username}`;
  const response = await fetch(url);

  const data = await response.json();

  return data;
};

export default function Container() {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [popularity, setPopularity] = useState(0);
  const [model, setModel] = useState<tf.GraphModel>();

  const getModel = async () => {
    const model = await tf.loadGraphModel(MODEL_URL);

    setModel(model);
  };

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwitterHandle(event.target.value);
  };

  const predict = async () => {
    const twitter = await getTwitter(twitterHandle);

    if (!twitter || !model || !twitterHandle) {
      return;
    }

    const { followers_count: followers } = twitter.legacy;
    console.log({ followers });

    const normalized = Math.log(parseFloat(followers));
    const x = tf.tensor(normalized).reshape([-1, 1]);
    const result: any = model.predict(x);
    const values = result.arraySync();
    const y = values[0][0].toFixed(2) * 100;

    setPopularity(y);
  };

  useEffect(() => {
    getModel();
  }, []);

  return (
    <>
      <input
        placeholder="Enter your twitter handle"
        value={twitterHandle}
        onChange={inputOnChange}
      />
      <button onClick={predict}>Predict</button>
      {popularity > 0 && <div>Popularity: {popularity}</div>}
    </>
  );
}
