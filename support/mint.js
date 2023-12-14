require("dotenv").config();

const EVENTS_API = `${process.env.NEXT_PUBLIC_EVENTS_API}/events`;

const logger = require("./logger.js")("mint");

async function saveEvent(payload) {
  const response = await fetch(`${EVENTS_API}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (response.status > 201) {
    logger.error("error saving event", { payload, data });
    return;
  }

  logger.info(`event saved`, { pk: data.pk });

  return response;
}

async function getEvents(query) {
  const response = await fetch(`${EVENTS_API}/?${query}`);

  const data = await response.json();

  return data.results;
}

async function updateEvent(eventPk, payload) {
  const response = await fetch(`${EVENTS_API}/${eventPk}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (response.status > 201) {
    logger.error(`error updating event:`, {
      eventPk,
      payload,
      data,
    });
    return;
  }

  logger.info(`event updated`, { pk: data.pk });

  return response;
}

async function saveLocation(payload) {
  const response = await fetch(`${EVENTS_API}/locations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (response.status > 201) {
    logger.error(`error saving location:`, {
      payload,
      data,
    });
    return;
  }

  logger.info(`location saved`, { slug: data.slug });

  return response;
}

async function getLocations(query) {
  const response = await fetch(`${EVENTS_API}/locations/?${query}`);

  const data = await response.json();

  return data.results;
}

async function updateLocation(pk, payload) {
  const response = await fetch(`${EVENTS_API}/locations/${pk}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (response.status > 201) {
    logger.error(`error updating location:`, {
      pk,
      payload,
      data,
    });
    return;
  }

  logger.info(`location updated`, { pk: data.pk });

  return response;
}

async function saveMetadata(payload) {
  const response = await fetch(`${EVENTS_API}/metadata/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (response.status > 201) {
    logger.error(`Error saving metadata`, {
      payload,
      data,
    });
    return;
  }

  logger.info(`metadata saved`, {
    slug: data.slug,
  });

  return response;
}

async function getArtists(query) {
  const response = await fetch(`${EVENTS_API}/artists/?${query}`);

  const data = await response.json();

  return data.results;
}

// async function saveArtist(payload) {
//   const response = await fetch(`${EVENTS_API}/artists/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();
//   if (response.status > 201) {
//     logger.error("Error saving artist", {
//       payload,
//       data,
//     });
//     return;
//   }

//   logger.info(`artist saved`, {
//     artist: data.slug,
//   });

//   return response;
// }

// async function updateArtist(artistPK, payload) {
//   const response = await fetch(`${ARTIST_API}/${artistPK}/`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (response.status > 201) {
//     logger.error("Error updating artist", {
//       artistPK,
//       payload,
//     });

//     return;
//   }

//   logger.info(`artist updated`, { artistPK });
// }

// async function rankEvents(payload) {
//   const response = await fetch(`${EVENTS_API}/rank/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();

//   logger.info("events ranked", data);
// }

module.exports = {
  saveEvent,
  getEvents,
  updateEvent,
  saveLocation,
  getLocations,
  updateLocation,
  saveMetadata,
  getArtists,
  // saveArtist,
  // updateLocationRetries,
  // saveLocationMetadata,
  // upsertGmaps,
  // getEvents,
  // getArtists,
  // saveArtistMetadata,
  // updateArtist,
  // rankEvents,
};
