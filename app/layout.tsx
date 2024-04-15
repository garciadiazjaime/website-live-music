import type { Metadata } from "next";

import StyledJsxRegistry from "./registry";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Live Music",
  description: "Live Music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          marginBottom: 0,
        }}>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
