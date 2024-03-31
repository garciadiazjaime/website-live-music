import type { Metadata } from "next";

import StyledJsxRegistry from "./registry";

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
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
