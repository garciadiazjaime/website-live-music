import Head from "next/head";

import ArticleLayout from "@/components/ArticleLayout";

import Container from "./container";

export default function Page() {
  return (
    <ArticleLayout title="Labs">
      <Head>
        <title>Chicago Music Compass | Live Music Events in Chicago</title>
        <meta property="og:title" content="Chicago Music Compass" />
        <meta
          property="og:description"
          content="Discover how popular your Twitter account is compared to famous artists"
        />
        <meta
          property="og:url"
          content="https://www.chicagomusiccompass.com/labs/artist-popularity-prediction"
        />
        <meta
          property="og:image"
          content="https://www.chicagomusiccompass.com/social/FB-Cover.jpg"
        />
      </Head>
      <h1>How popular are you?</h1>
      <Container />
    </ArticleLayout>
  );
}
