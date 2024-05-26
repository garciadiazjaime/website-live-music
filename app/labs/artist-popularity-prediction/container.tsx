"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import Loader from "@/components/Loader";
import { tokens } from "@/support/token";

const MODEL_URL = `${process.env.NEXT_PUBLIC_MODEL_URL!}/model.json`;

const getTwitter = async (username: string) => {
  const url = `/.netlify/functions/twitter?username=${username}`;
  const response = await fetch(url).catch(() => {});

  if (!response) {
    return;
  }

  const data = await response.json();

  return data;
};

export default function Container() {
  const [handle, setHandle] = useState("");
  const [popularity, setPopularity] = useState(0);
  const [model, setModel] = useState<tf.GraphModel>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getModel = async () => {
    const model = await tf.loadGraphModel(MODEL_URL);

    setModel(model);
  };

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      reset();
    }

    setHandle(event.target.value);
  };

  const reset = () => {
    setPopularity(0);
    setMessage("");
  };

  const predict = async () => {
    if (!handle) {
      return;
    }

    reset();

    setLoading(true);
    const twitter = await getTwitter(handle);
    setLoading(false);

    if (twitter.code) {
      setMessage(twitter.code);
      return;
    }

    if (!twitter || !model) {
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
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: 42 }}
      >
        <fieldset style={{ marginBottom: 12 }}>
          <legend>Twitter Handle</legend>
          <input
            value={handle}
            onChange={inputOnChange}
            style={{ fontSize: 42, width: "100%", border: "none", height: 48 }}
          />
        </fieldset>
        <button onClick={predict} style={{ fontSize: 42 }}>
          Predict
        </button>
      </div>

      <div style={{ fontSize: 42 }}>
        <div>Popularity: {popularity && <strong> {popularity}</strong>}</div>

        <div
          style={{
            border: `1px solid ${tokens.color.black}`,
            width: "100%",
            height: 48,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: "1%",
              height: 48,
              background: tokens.color.lightBlue,
              transition: "width 2s, height 4s",
              ...(popularity && {
                width: `${popularity}%`,
              }),
            }}
          ></div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            <div>1</div>
            <div>100</div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: 40,
          padding: "12px 0",
          color: tokens.color.red,
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 12,
        }}
      >
        {loading && <Loader />}
        {message && message}
      </div>
    </>
  );
}
