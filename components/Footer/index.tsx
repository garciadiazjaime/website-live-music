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
        border: "solid 1px #ff2751",
        padding: 20,
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          color: "#64C7F9",
          marginTop: 0,
        }}
      >
        About Us:
      </h2>
      <p>
        Welcome to Chicago Music Compass! 🎶 We&apos;re not just another tech
        team – we&apos;re music enthusiasts, bandmates, and tech wizards on a
        mission to shake up the Windy City&apos;s live music scene. 🌬️🎸
      </p>
      <p>
        Our journey began with a passion for live music, fueled by our
        experiences on stage and in the crowd. Now, armed with our tech
        expertise, we&apos;re ready to give back to the community that brings us
        so much joy.
      </p>
      <p>
        At Chicago Music Compass, we&apos;re all about data-driven insights and
        rockin&apos; revelations. 📊🎤 We&apos;ve scoured the city to compile
        live show data – dates, venues, artists, and more – all served up for
        your browsing pleasure.
      </p>
      <p>
        But we&apos;re not stopping there. 🛑 Our next riff? Dive deep into the
        data, spotlighting Chicago&apos;s music scene. 🌟 From interactive
        dashboards to insightful correlations, we&apos;re here to help venues
        fine-tune their tunes and fans discover their next favorite gig.
      </p>
      <p>
        Join us on this wild ride. Have an idea for a killer feature? Hit us up
        – we&apos;re all ears! 🎶
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
          <a href="https://www.tiktok.com/@livemusic210" rel="nofollow">
            TikTok
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/people/Playami-Town/pfbid0km55nti3TSQbd1Nu1FoiDREZfpu1adEG3CAzzVaKAuw4SLZoz7vKwUAZ2UZyEejjl/"
            rel="nofollow"
          >
            Facebook
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/playamitown/" rel="nofollow">
            Instagram
          </a>
        </li>
        <li>
          <a href="https://twitter.com/livemusic210" rel="nofollow">
            Twitter
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/channel/UCWJE0M7LgZjKBvvceSmSEBw"
            rel="nofollow"
          >
            Youtube
          </a>
        </li>
      </ul>
    </div>
    <style jsx>{`
      .footer {
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
      }
    `}</style>
  </footer>
);

export default Footer;
