"use client";

import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";

const MODEL_URL = "https://d2r5kaieomhckh.cloudfront.net/public/model.json";

const getTfModel = async () => {
  return await tf.loadGraphModel(MODEL_URL);
};

export default function Page() {
  const [followCount, setFollowCount] = useState("");
  const [popularity, setPopularity] = useState(0);
  const [tfModel, setTfModel] = useState<tf.GraphModel>();

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFollowCount(value);
  };

  const predict = () => {
    if (!tfModel || !followCount) {
      console.log("Model not set or followCount empty");
      return;
    }

    const modelInput = tf.tensor(parseFloat(followCount)).reshape([-1, 1]);
    console.log("Input:", modelInput.toString());
    const prediction: any = tfModel.predict(modelInput);
    console.log("Prediction:", prediction.toString());
    const predictionValues = prediction.arraySync();
    const formattedPopularity = predictionValues[0][0].toFixed(2);
    setPopularity(formattedPopularity);
  };

  useEffect(() => {
    const fetchModel = async () => {
      const model = await getTfModel();
      setTfModel(model);
    };
    fetchModel().catch(console.error);
  }, []);

  return (
    <div className="mt-12 w-1/2 mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-extrabold">How popular are you?</h1>
      <input
        className="h-10 w-full mt-12 pl-2 border-solid border-2 rounded-md"
        placeholder="Enter your twitter followers"
        value={followCount}
        onChange={inputOnChange}
        type="number"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-6 rounded-md h-10 w-full"
        onClick={predict}
      >
        Predict
      </button>
      {popularity > 0 && (
        <div className="mt-12 font-bold">Popularity: {popularity}</div>
      )}
    </div>
  );
}
