import { ReactNode } from "react";
import Link from "next/link";

export const MessageLink = ({ href, children, theme }: { href: string, children: ReactNode, theme: boolean }) => (
<Link
  href={href}
  style={{
    display: 'flex',
    columnGap: '1rem',
    borderLeft: `1px solid ${theme ? '#DB2545' : '#0D81CA'}`,
    padding: '1rem',
    color: theme ? '#DB2545' : '#0D81CA',
    alignItems: 'center',
    textDecoration: 'none',
  }}
  >
  {children}
  <span style={{
      border: `5px solid ${theme ? '#DB2545' : '#0D81CA'}`,
      borderTop: 'solid 5px transparent',
      borderRight: 'solid 5px transparent',
      borderBottom: 'solid 5px transparent',
      height: 1,
      marginBottom: "-2px",
    }}
  />
  </Link>)

const MessageCard = ({ message, theme }: { message: any, theme: boolean}) => (
  <div
    style={{
      border: `1px solid ${theme ? '#DB2545' : '#0D81CA'}`,
      width: '100%',
      fontSize: '1.2rem',
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: '20',
    }}>
      <div
        style={{
          padding: '1rem',
        }}
      >
        {message.text}
      </div>
      <MessageLink href={message.link.url} theme={theme}>
        {message.link.title}
      </MessageLink>
    </div>
  </div>
)

export default MessageCard;
