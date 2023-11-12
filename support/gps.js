const { Client } = require("@googlemaps/google-maps-services-js");
const async = require("async");

require("dotenv").config();

const {
  getLocations,
  updateLocationRetries,
  upsertGmaps,
} = require("./eventService");
const { pbcopy } = require("./keyboard");

async function askGPT() {
  const addresses = events
    .slice(0, 1)
    .map(
      (item, index) =>
        `${item.location.name} with address: ${item.location.address.streetAddress}, ${item.location.address.addressLocality}, ${item.location.address.postalCode}`
    );
  const prompt = `coordinates and nothing else for: ${addresses.join("\n")}.`;

  pbcopy(prompt);
  console.log("GPS prompt copied");
  console.log("ask GPT");
}

async function main() {
  console.log("starting gps...");

  const locations = await getLocations();

  if (!Array.isArray(locations) || !locations.length) {
    console.log("no locations to process");
    return;
  }

  console.log(`processing ${locations.length} locations`);

  const client = new Client({});

  await async.eachSeries(locations, async (location) => {
    const params = {
      input: location.name,
      inputtype: "textquery",
      key: process.env.GOOGLE_MAPS_API_KEY,
      fields: ["place_id", "name", "formatted_address", "geometry"],
      locationbias: "41.8336152,-87.8967663,1000",
    };

    return client
      .findPlaceFromText({ params })
      .then(async (gmapsResponse) => {
        console.log(`processing: ${location.name}`);
        if (
          !Array.isArray(gmapsResponse.data.candidates) ||
          !gmapsResponse.data.candidates.length
        ) {
          console.log(`gmaps didn't find gps for: ${location.name}`);

          const response = await updateLocationRetries(location.pk);

          console.log(
            `gps tries saved: ${location.name}, status: ${response.status}`
          );
          return;
        }

        const { formatted_address, geometry, name, place_id } =
          gmapsResponse.data.candidates[0];
        const payload = {
          lat: geometry?.location.lat,
          lng: geometry?.location.lng,
          formatted_address,
          name,
          place_id,
          location: location.pk,
        };

        const response = await upsertGmaps(payload);

        const data = await response.json();
        if (response.status !== 201) {
          console.log("Error saving gps");
          console.log(
            "gmapsResponse",
            gmapsResponse.status,
            gmapsResponse.data
          );
          console.log(payload);
          console.log(data);
        } else {
          console.log(`gps saved: ${location.name}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

main().then(() => {
  console.log("end");
});
