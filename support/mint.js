const EVENTS_API = `${process.env.NEXT_PUBLIC_EVENTS_API}/events`;

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

module.exports = {
  getLocations,
  updateLocationRetries,
  upsertGmaps,
  getEvents,
};
