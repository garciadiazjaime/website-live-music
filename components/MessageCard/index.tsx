import { ReactNode } from "react";
import Link from "next/link";
import { tokens } from "@/support/token";

export const MessageLink = ({ href, children }: { href: string, children: ReactNode }) => (
<Link
  href={href}
  style={{
    display: 'flex',
    columnGap: '1rem',
    borderLeft: '1px solid red'
  }}
  >
  {children}
  <span style={{
      border: 'solid 5px white',
      borderTop: 'solid 5px transparent',
      borderRight: 'solid 5px transparent',
      borderBottom: 'solid 5px transparent',
      height: 1
    }}
  />
  </Link>)

const MessageCard = ({ children }: { children: ReactNode | ReactNode[]}) => (
  <div
    style={{
      border: '1px solid red',
      width: '100%',
    }}
  >
    <div style={{
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: '20',
    }}>
      {children}
    </div>
  </div>
)

export default MessageCard;
