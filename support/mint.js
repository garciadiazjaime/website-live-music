require("dotenv").config();

const EVENTS_API = `${process.env.NEXT_PUBLIC_EVENTS_API}/events`;
const ARTIST_API = `${EVENTS_API}/artists`;

const logger = require("./logger.js")("mint");

async function getLocations(query) {
  const response = await fetch(`${EVENTS_API}/locations/?${query}`);

  const data = await response.json();

  return data.results;
}

async function saveLocationMetadata(payload) {
  const response = await fetch(`${EVENTS_API}/locations/metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.status > 201) {
    logger.error(`Error saving location metadata`, {
      payload,
      data,
    });
    return;
  }

  logger.info(`location metadata saved`, {
    location: payload.location,
  });
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

async function updateLocationRetries(locationPk, payload) {
  const response = await fetch(`${EVENTS_API}/locations/${locationPk}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status > 201) {
    const data = await response.json();
    logger.error(`Error updating location:`, {
      locationPk,
      data,
    });
  } else {
    logger.info(`location updated`, { locationPk });
  }

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

async function updateArtist(artistPK, payload) {
  const response = await fetch(`${ARTIST_API}/${artistPK}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status > 201) {
    logger.error("Error updating artist", {
      artistPK,
      payload,
    });

    return;
  }

  logger.info(`artist updated`, { artistPK });
}

async function saveArtistMetadata(payload) {
  const response = await fetch(`${ARTIST_API}/metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.status > 201) {
    logger.error("Error saving artist metadata", {
      data,
      payload,
    });
    return;
  }

  logger.info(`artist metadata saved`, {
    artist: payload.artist,
  });

  return response;
}

async function rankEvents(payload) {
  const response = await fetch(`${EVENTS_API}/rank/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  logger.info("events ranked", data);
}

module.exports = {
  getLocations,
  updateLocationRetries,
  saveLocationMetadata,
  upsertGmaps,
  getEvents,
  getArtists,
  saveArtistMetadata,
  updateArtist,
  rankEvents,
};
