require("dotenv").config();

const EVENTS_API = `${process.env.NEXT_PUBLIC_EVENTS_API}/events`;
const ARTIST_API = `${EVENTS_API}/artists`;

async function getLocations(query) {
  const response = await fetch(`${EVENTS_API}/locations/?${query}`);

  const data = await response.json();

  return data.results;
}

async function upsertGmaps(payload) {
  const response = await fetch(`${EVENTS_API}/locations/gmaps/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response;
}

async function updateLocationRetries(locationPk) {
  const response = await fetch(`${EVENTS_API}/locations/${locationPk}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

async function getEvents(query) {
  const response = await fetch(`${EVENTS_API}/?${query}`);

  const data = await response.json();

  return data.results;
}

async function getArtists(query) {
  const response = await fetch(`${ARTIST_API}/?${query}`);

  const data = await response.json();

  return data.results;
}

async function saveArtistMetadata(artist) {
  const response = await fetch(`${ARTIST_API}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artist),
  });

  const data = await response.json();
  if (response.status !== 201) {
    console.log("Error saving artist metadata");
    console.log(artist);
    console.log(data);
    return;
  }

  console.log(`matadata saved: ${artist.name}`);
}

module.exports = {
  getLocations,
  updateLocationRetries,
  upsertGmaps,
  getEvents,
  getArtists,
  saveArtistMetadata,
};
