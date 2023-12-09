const { Client } = require("@googlemaps/google-maps-services-js");
const async = require("async");

const { sleep } = require("./misc");
const logger = require("./logger.js")("gps");

require("dotenv").config();

const { getLocations, updateLocationRetries, upsertGmaps } = require("./mint");

async function main() {
  logger.info("starting gps");
  const query = "gmaps_empty=true&gmaps_tries=3&ordering=gmaps_tries&limit=100";
  const locations = await getLocations(query).catch((error) => {
    logger.error(error);
  });

  if (!Array.isArray(locations) || !locations.length) {
    logger.info("no locations to process");
    return;
  }

  logger.info(`locations found`, { total: locations.length });

  const client = new Client({});

  await async.eachSeries(locations, async (location) => {
    await sleep();

    const params = {
      input: location.name,
      inputtype: "textquery",
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      fields: ["place_id", "name", "formatted_address", "geometry"],
      locationbias: {
        circle: {
          center: {
            lat: 41.8336152,
            lng: -87.8967663,
          },
          radius: 30_000, // Radius in meters
        },
      },
    };

    const gmapsResponse = await client
      .findPlaceFromText({ params })
      .catch((error) => logger.error(error));

    if (
      !Array.isArray(gmapsResponse.data?.candidates) ||
      !gmapsResponse.data.candidates.length
    ) {
      logger.info(`gps not found`, {
        pk: location.pk,
        name: location.name,
      });

      const response = await updateLocationRetries(location.pk);

      logger.info(`gps tries saved`, {
        pk: location.pk,
        name: location.name,
        status: response.status,
      });
      return;
    }

    logger.info(`processing location`, {
      pk: location.pk,
      name: location.name,
    });

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
      logger.error(`Error saving gps`, {
        pk: location.pk,
        status: gmapsResponse.status,
        gmaps: gmapsResponse.data,
        payload,
        response: data,
      });
    } else {
      logger.info(`gps saved`, {
        pk: location.pk,
        name: location.name,
      });
    }
  });
}

main().then(() => {
  logger.info("finished gps");
  logger.flush();
});
