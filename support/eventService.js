const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API;

async function getLocations() {
  const response = await fetch(`${EVENTS_API}/locations/`);

  return response.json();
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

module.exports = {
  getLocations,
  updateLocationRetries,
  upsertGmaps,
};
