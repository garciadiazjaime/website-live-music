import { Event } from "../../support/types";

const doHTTPS = (url: string) => url?.replace("http:", "https:");

export const getImage = (event: Event): string => {
  const artist = event.artists?.find((artist) => artist.metadata?.image);
  if (artist) {
    return doHTTPS(artist.metadata?.image || "");
  }

  if (event.location?.metadata?.image) {
    return doHTTPS(event.location.metadata.image);
  }

  return doHTTPS(event.image);
};

export const DateTime = ({ time }: { time: string }) => {
  const value = parseInt(time);
  const hour = value > 12 ? value % 12 : value;
  const meridiem = value > 12 ? "PM" : "AM";

  return (
    <>
      {hour} <span style={{ fontSize: "1rem" }}>{meridiem}</span>
    </>
  );
};
