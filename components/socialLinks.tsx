import { tokens } from "@/support/token";
import { Event, Social, SocialMedia, Spotify } from "@/support/types";

const fill = "rgb(125, 211, 252)";

export const logos = {
  discord: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 127.14 96.36"
    >
      <path
        fill={fill}
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />
    </svg>
  ),
  twitter: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
      />
    </svg>
  ),
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"
      />
    </svg>
  ),
  youtube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
      />
    </svg>
  ),
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  ),
  tiktok: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 449.45 515.38"
    >
      <path
        fill={fill}
        d="M382.31 103.3c-27.76-18.1-47.79-47.07-54.04-80.82-1.35-7.29-2.1-14.8-2.1-22.48h-88.6l-.15 355.09c-1.48 39.77-34.21 71.68-74.33 71.68-12.47 0-24.21-3.11-34.55-8.56-23.71-12.47-39.94-37.32-39.94-65.91 0-41.07 33.42-74.49 74.48-74.49 7.67 0 15.02 1.27 21.97 3.44V190.8c-7.2-.99-14.51-1.59-21.97-1.59C73.16 189.21 0 262.36 0 352.3c0 55.17 27.56 104 69.63 133.52 26.48 18.61 58.71 29.56 93.46 29.56 89.93 0 163.08-73.16 163.08-163.08V172.23c34.75 24.94 77.33 39.64 123.28 39.64v-88.61c-24.75 0-47.8-7.35-67.14-19.96z"
      />
    </svg>
  ),
  soundcloud: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"
      />
    </svg>
  ),
  spotify: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={fill}
        d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"
      />
    </svg>
  ),
  appleMusic: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"
      />
    </svg>
  ),
  website: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 122.879 122.879"
    >
      <path
        fill={fill}
        d="M109.465,89.503c0.182,0,0.359,0.019,0.533,0.053c1.146-1.998,2.191-4.095,3.135-6.286 c0.018-0.044,0.037-0.086,0.059-0.128c1.418-3.345,2.488-6.819,3.209-10.419c0.559-2.793,0.904-5.657,1.035-8.591h-16.893 c-0.307,8.574-2.867,17.03-7.639,25.371H109.465L109.465,89.503z M106.52,94.889H89.506c-5.164,7.481-12.121,14.87-20.838,22.167 c1.367-0.17,2.719-0.388,4.055-0.655c3.646-0.729,7.164-1.817,10.549-3.264l-0.002-0.004c3.441-1.48,6.646-3.212,9.609-5.199 c2.969-1.992,5.721-4.255,8.25-6.795l0.01-0.01l0,0C103.096,99.18,104.889,97.099,106.52,94.889L106.52,94.889z M54.21,117.055 c-8.716-7.296-15.673-14.685-20.838-22.166H16.361c1.631,2.21,3.423,4.291,5.379,6.24l0.01,0.011v-0.001 c2.53,2.54,5.282,4.803,8.25,6.795c2.962,1.987,6.167,3.719,9.609,5.199c0.043,0.019,0.086,0.038,0.128,0.059 c3.345,1.419,6.819,2.488,10.42,3.209C51.493,116.668,52.843,116.886,54.21,117.055L54.21,117.055z M12.852,89.503h17.122 c-4.771-8.341-7.332-16.797-7.637-25.371H5.445c0.13,2.934,0.475,5.797,1.034,8.59c0.729,3.646,1.818,7.164,3.264,10.549 l0.004-0.001C10.682,85.442,11.716,87.521,12.852,89.503L12.852,89.503z M5.445,58.747h16.997c0.625-8.4,3.412-16.857,8.407-25.371 H12.852c-1.136,1.982-2.17,4.061-3.105,6.234c-0.019,0.043-0.039,0.086-0.059,0.127C8.269,43.083,7.2,46.557,6.479,50.157 C5.92,52.95,5.575,55.814,5.445,58.747L5.445,58.747z M16.361,27.991h17.938c5.108-7.361,11.862-14.765,20.29-22.212 c-1.496,0.175-2.973,0.408-4.431,0.7c-3.647,0.729-7.164,1.818-10.549,3.264l0.001,0.003c-3.442,1.481-6.647,3.212-9.609,5.2 c-2.968,1.992-5.72,4.255-8.25,6.794l-0.011,0.01h0C19.784,23.7,17.992,25.78,16.361,27.991L16.361,27.991z M68.289,5.778 c8.428,7.447,15.182,14.851,20.291,22.212h17.939c-1.631-2.21-3.424-4.291-5.381-6.24l-0.01-0.01l0,0 c-2.529-2.54-5.281-4.802-8.25-6.794c-2.963-1.988-6.168-3.719-9.609-5.2c-0.043-0.018-0.086-0.038-0.127-0.059 c-3.346-1.418-6.82-2.488-10.42-3.208C71.264,6.187,69.785,5.954,68.289,5.778L68.289,5.778z M110.027,33.376H92.029 c4.996,8.514,7.783,16.971,8.408,25.371h16.998c-0.131-2.934-0.477-5.797-1.035-8.59c-0.73-3.646-1.818-7.164-3.264-10.549 l-0.004,0.002C112.197,37.437,111.164,35.358,110.027,33.376L110.027,33.376z M49.106,1.198C53.098,0.399,57.21,0,61.44,0 c4.23,0,8.341,0.399,12.333,1.198c3.934,0.788,7.758,1.97,11.473,3.547c0.051,0.018,0.1,0.037,0.148,0.058 c3.703,1.594,7.197,3.485,10.471,5.684c3.268,2.192,6.291,4.677,9.066,7.462c2.785,2.775,5.27,5.799,7.461,9.065 c2.197,3.275,4.09,6.768,5.684,10.473l-0.004,0.001l0.004,0.009c1.607,3.758,2.809,7.628,3.605,11.609 c0.799,3.992,1.197,8.104,1.197,12.334c0,4.23-0.398,8.343-1.197,12.335c-0.787,3.932-1.971,7.758-3.547,11.472 c-0.018,0.05-0.037,0.099-0.059,0.147c-1.594,3.705-3.486,7.197-5.684,10.472c-2.191,3.267-4.676,6.29-7.461,9.065 c-2.775,2.785-5.799,5.271-9.066,7.462c-3.273,2.198-6.768,4.091-10.471,5.684l-0.002-0.004l-0.01,0.004 c-3.758,1.606-7.629,2.808-11.609,3.604c-3.992,0.799-8.104,1.198-12.333,1.198c-4.229,0-8.342-0.399-12.334-1.198 c-3.933-0.787-7.758-1.97-11.474-3.546c-0.049-0.019-0.098-0.037-0.147-0.059c-3.705-1.593-7.197-3.485-10.472-5.684 c-3.266-2.191-6.29-4.677-9.065-7.462c-2.785-2.775-5.27-5.799-7.461-9.065c-2.198-3.274-4.09-6.767-5.684-10.472l0.004-0.002 l-0.004-0.009c-1.606-3.758-2.808-7.628-3.604-11.609C0.4,69.782,0,65.67,0,61.439c0-4.229,0.4-8.342,1.199-12.334 c0.787-3.933,1.97-7.758,3.546-11.473c0.018-0.049,0.037-0.099,0.058-0.147c1.594-3.705,3.485-7.198,5.684-10.473 c2.192-3.266,4.677-6.29,7.461-9.065c2.775-2.785,5.799-5.27,9.065-7.462c3.275-2.198,6.768-4.09,10.472-5.684l0.001,0.004 l0.009-0.004C41.254,3.197,45.125,1.995,49.106,1.198L49.106,1.198z M64.133,9.268v18.723h17.826 C77.275,21.815,71.34,15.575,64.133,9.268L64.133,9.268z M64.133,33.376v25.371h30.922c-0.699-8.332-3.789-16.788-9.318-25.371 H64.133L64.133,33.376z M64.133,64.132v25.371h22.51c5.328-8.396,8.189-16.854,8.531-25.371H64.133L64.133,64.132z M64.133,94.889 v18.952c7.645-6.283,13.902-12.601,18.746-18.952H64.133L64.133,94.889z M58.747,113.843V94.889H40 C44.843,101.24,51.1,107.559,58.747,113.843L58.747,113.843z M58.747,89.503V64.132H27.706c0.341,8.518,3.201,16.975,8.531,25.371 H58.747L58.747,89.503z M58.747,58.747V33.376H37.143c-5.529,8.583-8.619,17.04-9.319,25.371H58.747L58.747,58.747z M58.747,27.991 V9.266C51.54,15.573,45.604,21.815,40.92,27.991H58.747L58.747,27.991z"
      />
    </svg>
  ),
};

const clickHandler = (url: string) => window.open(url, "_blank");

const socials = [
  "twitter",
  "facebook",
  "youtube",
  "instagram",
  "tiktok",
  "soundcloud",
  "spotify",
  "appleMusic",
];

const getLinks = (event: Event) => {
  const { artists, location } = event;

  const links: { logo: React.ReactElement; url: string }[] = [];

  artists?.forEach((artist) => {
    if (!artist.metadata) {
      return;
    }

    const { metadata, spotify } = artist;

    socials.forEach((social) => {
      const _link: string | Spotify | null = metadata[social as keyof Social];
      if (_link && links.length < 4) {
        links.push({
          logo: logos[social as keyof SocialMedia],
          url: _link as string,
        });
      }
    });
  });

  if (location.metadata) {
    const { metadata } = location;

    socials.forEach((social) => {
      const _link = metadata[social as keyof Social];
      if (_link && links.length < 4) {
        links.push({
          logo: logos[social as keyof SocialMedia],
          url: _link as string,
        });
      }
    });
  }

  return links;
};

export default function SocialLinks(props: { event: Event }) {
  const links = getLinks(props.event);

  return links.map((link, index) => (
    <div
      key={index}
      onClick={() => clickHandler(link.url!)}
      className="socialLink"
    >
      {link.logo}
      <style jsx>{`
        .socialLink {
          display: flex;
          cursor: pointer;
          padding: 16px;
          opacity: 0.6;

          &:active {
            opacity: 1;
          }

          @media (min-width: ${tokens.breakpoints.lg}) {
            &:hover {
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  ));
}

const getLinksV2 = (event: Event) => {
  const { artists } = event;

  const links: { logo: React.ReactElement; name: string; url: string }[] = [];

  const artist = artists[0];
  if (!artist?.metadata) {
    return [];
  }

  if (artist.spotify) {
    links.push({
      logo: logos.spotify,
      name: artist.spotify.name,
      url: artist.spotify.url,
    });
  }

  if (artist.metadata.instagram) {
    links.push({
      logo: logos.instagram,
      name: new URL(artist.metadata.instagram).pathname.replaceAll("/", ""),
      url: artist.metadata.instagram,
    });
  }

  if (artist.metadata.facebook) {
    links.push({
      logo: logos.facebook,
      name: new URL(artist.metadata.facebook).pathname.replaceAll("/", ""),
      url: artist.metadata.facebook,
    });
  }

  if (artist.metadata.website) {
    links.push({
      logo: logos.website,
      name: new URL(artist.metadata.website).hostname.replace("www.", ""),
      url: artist.metadata.website,
    });
  }

  return links;
};

export function SocialLinksV2(props: { event: Event }) {
  const links = getLinksV2(props.event).slice(0, 2);

  return (
    <>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          style={{
            display: "flex",
            color: fill,
            textDecoration: "none",
            gap: 6,
            padding: "6px 0",
            fontSize: 16,
          }}
        >
          <span>{link.logo}</span>
          <span>{link.name}</span>
        </a>
      ))}
    </>
  );
}
