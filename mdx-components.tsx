import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { codeToHtml } from "shiki";

import { tokens } from "@/support/token";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        style={{
          fontSize: 42,
          borderBottom: `2px solid ${tokens.color.primary}`,
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: 28, marginTop: 86 }}>{children}</h2>
    ),
    p: ({ children }) => <p style={{ fontSize: 24 }}>{children}</p>,
    em: ({ children }) => (
      <em style={{ fontSize: 18, textAlign: "center", display: "block" }}>
        {children}
      </em>
    ),
    code: async (props) => {
      const lang = props.className?.split("-")[1] || "javascript";

      const html = await codeToHtml(props.children as string, {
        lang,
        theme: "solarized-light",
      });

      return <code dangerouslySetInnerHTML={{ __html: html }} />;
    },
    img: (props) => (
      <Image
        width={400}
        height={400}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    li: ({ children }) => <li style={{ fontSize: 24 }}>{children}</li>,
    ...components,
  };
}
