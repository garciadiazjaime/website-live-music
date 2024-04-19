"use client";

import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";

const MODEL_URL = "https://d2r5kaieomhckh.cloudfront.net/public/model.json";

const getTfModel = async () => {
  return await tf.loadGraphModel(MODEL_URL);
};

export default function Page() {
  const [followCount, setFollowCount] = useState("");
  const [popularity, setPopularity] = useState(0);
  const [tfModel, setTfModel] = useState<tf.GraphModel>();

  const getTfModel = async () => {
    const model = await tf.loadGraphModel(MODEL_URL);
    setTfModel(model);
  };

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFollowCount(value);
  };

  const predict = () => {
    if (!tfModel || !followCount) {
      console.log("Model not set or followCount empty");
      return;
    }

    const formattedInput = Math.log(parseFloat(followCount));
    const modelInput = tf.tensor(formattedInput).reshape([-1, 1]);
    const prediction: any = tfModel.predict(modelInput);
    const predictionValues = prediction.arraySync();
    const formattedPopularity = predictionValues[0][0].toFixed(2) * 100;
    setPopularity(formattedPopularity);
  };

  useEffect(() => {
    getTfModel().catch(console.error);
  }, []);

  return (
    <>
      <h1>How popular are you?</h1>
      <input
        placeholder="Enter your twitter followers"
        value={followCount}
        onChange={inputOnChange}
        type="number"
      />
      <button onClick={predict}>Predict</button>
      {popularity > 0 && <div>Popularity: {popularity}</div>}
    </>
  );
}
