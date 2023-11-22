const { Client } = require("@googlemaps/google-maps-services-js");
const async = require("async");

const { sleep } = require("./misc");

require("dotenv").config();

const { getLocations, updateLocationRetries, upsertGmaps } = require("./mint");

async function main() {
  console.log("starting gps...");
  const query = "gmaps_empty=true&gmaps_tries=3";
  const locations = await getLocations(query).catch((error) => {
    console.log(error);
  });

  if (!Array.isArray(locations) || !locations.length) {
    console.log("no locations to process");
    return;
  }

  console.log(`${locations.length} locations found`);

  const client = new Client({});

  await async.eachSeries(locations, async (location) => {
    await sleep();

    const params = {
      input: location.name,
      inputtype: "textquery",
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      fields: ["place_id", "name", "formatted_address", "geometry"],
      locationbias: "41.8336152,-87.8967663,1000",
    };

    const gmapsResponse = await client
      .findPlaceFromText({ params })
      .catch((error) => console.log(error));

    if (
      !Array.isArray(gmapsResponse.data?.candidates) ||
      !gmapsResponse.data.candidates.length
    ) {
      console.log(`gmaps didn't find gps for: ${location.name}`);

      const response = await updateLocationRetries(location.pk);

      console.log(
        `gps tries saved: ${location.name}, status: ${response.status}`
      );
      return;
    }

    console.log(`processing: ${location.name}`);

    const { formatted_address, geometry, name, place_id } =
      gmapsResponse.data.candidates[0];
    const payload = {
      lat: geometry.location.lat,
      lng: geometry.location.lng,
      formatted_address,
      name,
      place_id,
      location: location.pk,
    };

    const response = await upsertGmaps(payload);

    const data = await response.json();
    if (response.status !== 201) {
      console.log("Error saving gps");
      console.log("gmapsResponse", gmapsResponse.status, gmapsResponse.data);
      console.log(payload);
      console.log(data);
    } else {
      console.log(`gps saved: ${location.name}`);
    }
  });
}

main().then(() => {
  console.log("end");
});
