import Link from "next/link";

import { tokens } from "@/support/token";
import { logos } from "@/components/socialLinks";

const Footer = () => (
  <footer
    className="footer"
    id="cmc"
    style={{
      padding: 20,
      margin: "0 20px 20px",
      fontSize: 20,
      width: "calc(100% - 80px)",
      maxWidth: "780px",
      fontFamily: "sans-serif",
      backgroundImage:
        "linear-gradient(90deg, rgba(23, 37, 84), rgba(67, 20, 7, 1))",
    }}
  >
    <div
      style={{
        border: `solid 1px ${tokens.color.red}`,
        padding: 20,
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          color: tokens.color.lightBlue,
          marginTop: 0,
        }}
      >
        About Us:
      </h2>
      <p>
        Welcome to Chicago Music Compass! We&apos;re not just another tech team
        – we&apos;re music enthusiasts, bandmates, and tech wizards on a mission
        to shake up the Windy City&apos;s live music scene.
      </p>
      <p>
        Our journey began with a passion for live music, fueled by our
        experiences on stage and in the crowd. Now, armed with our tech
        expertise, we&apos;re ready to give back to the community that brings us
        so much joy.
      </p>
      <p>
        At Chicago Music Compass, we&apos;re all about data-driven insights and
        rocking revelations. We&apos;ve scoured the city to compile live show
        data – dates, venues, artists, and more – all served up for your
        browsing pleasure.
      </p>
      <p>
        But we&apos;re not stopping there. Our next riff? Dive deep into the
        data, spotlighting Chicago&apos;s music scene. From interactive
        dashboards to insightful correlations, we&apos;re here to help venues
        fine-tune their tunes and fans discover their next favorite gig.
      </p>
      <p>
        Join us on this wild ride. Have an idea for a killer feature? Hit us up
        – we&apos;re all ears!
      </p>
      <br />
      <h2
        style={{
          fontSize: "1.5rem",
          color: "#64C7F9",
        }}
      >
        Follow us on:
      </h2>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          flexWrap: "wrap",
          margin: 0,
          padding: 0,
          justifyContent: "space-between",
        }}
      >
        <li>
          <a
            href="https://www.tiktok.com/@livemusic210"
            rel="nofollow"
            aria-label="follow us on Tiktok"
          >
            {logos.tiktok}
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/people/ChicagoMusic-Compass/pfbid0kWe8UUC8ZtAowz5wx5S4ygKrZ3eTGAnYhhB95x5obRLwuD8vN5JZ3G16k4S3DWZRl/"
            rel="nofollow"
            aria-label="follow us on Facebook"
          >
            {logos.facebook}
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/chicagomusiccompass/"
            rel="nofollow"
            aria-label="follow us on Instagram"
          >
            {logos.instagram}
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/livemusic210"
            rel="nofollow"
            aria-label="follow us on Twitter"
          >
            {logos.twitter}
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/channel/UCWJE0M7LgZjKBvvceSmSEBw"
            rel="nofollow"
            aria-label="follow us on Youtube"
          >
            {logos.youtube}
          </a>
        </li>
      </ul>

      <h2
        style={{
          fontSize: "1.5rem",
          color: "#64C7F9",
        }}
      >
        More about the project
      </h2>

      <ul
        style={{
          display: "flex",
          listStyle: "none",
          flexWrap: "wrap",
          margin: 0,
          padding: 0,
          flexDirection: "column",
        }}
      >
        <li>
          <Link
            href="/blog/artists-popularity-model"
            style={{ color: tokens.color.white, textDecoration: "none" }}
          >
            Blog
          </Link>
        </li>
        <li>
          <Link
            href="/labs/artist-popularity-prediction"
            style={{ color: tokens.color.white, textDecoration: "none" }}
          >
            Labs
          </Link>
        </li>
      </ul>
    </div>
    <style jsx>{`
      a {
        color: white;
        text-decoration: none;

        &:hover {
          color: #ff2751;
        }
      }

      p {
        font-size: 16px;
      }
    `}</style>
  </footer>
);

export default Footer;
