"use client";

import TagManager from "react-gtm-module";

import { useEffect } from "react";

const tagManagerArgs = {
  gtmId: "GTM-5TDDZW8S",
};

export default function Home() {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <main>
      <h1>Live Music</h1>
    </main>
  );
}
