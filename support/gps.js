const { Client } = require("@googlemaps/google-maps-services-js");
const async = require("async");

const { sleep } = require("./misc");
const logger = require("./logger.js")("gps");

require("dotenv").config();

const { getEvents, updateEvents, saveLocation } = require("./mint");

async function main() {
  logger.info("starting gps");
  const query =
    "location_empty=true&gmaps_tries=3&ordering=gmaps_tries&limit=1";
  const events = await getEvents(query);

  if (!Array.isArray(events) || !events.length) {
    logger.info("no events to process");
    return;
  }

  logger.info(`events found`, { total: events.length });

  const client = new Client({});

  await async.eachSeries(events, async (event) => {
    await sleep();

    const params = {
      input: event.venue,
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
        pk: event.pk,
        name: event.name,
      });

      await updateEvents(event.pk, { gmaps_tries: 1 });
      return;
    }

    logger.info(`processing location`, {
      eventPk: event.pk,
      eventName: event.slug,
    });

    const { formatted_address, geometry, name, place_id } =
      gmapsResponse.data.candidates[0];
    const payload = {
      name,
      address: formatted_address,
      lat: geometry.location.lat.toFixed(6),
      lng: geometry.location.lng.toFixed(6),
      place_id,
      event: event.pk,
    };

    const response = await saveLocation(payload);
    if (!response) {
      await updateEvents(event.pk, { gmaps_tries: 1 });
    }
  });
}

main().then(() => {
  logger.info("finished gps");
  logger.flush();
});
