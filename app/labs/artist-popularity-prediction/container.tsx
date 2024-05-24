"use client";

import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";

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
  const [tfModel, setTfModel] = useState<tf.GraphModel>();

  const getTfModel = async () => {
    const model = await tf.loadGraphModel(MODEL_URL);
    setTfModel(model);
  };

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTwitterHandle(value);
  };

  const predict = async () => {
    const twitter = await getTwitter(twitterHandle);

    if (!twitter || !tfModel || !twitterHandle) {
      return;
    }

    const { followers_count: followers } = twitter.legacy;
    console.log({ followers });
    const formattedInput = Math.log(parseFloat(followers));
    const modelInput = tf.tensor(formattedInput).reshape([-1, 1]);
    const prediction: any = tfModel.predict(modelInput);
    const predictionValues = prediction.arraySync();
    const formattedPopularity = predictionValues[0][0].toFixed(2) * 100;
    setPopularity(formattedPopularity);
  };

  useEffect(() => {
    getTfModel();
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
