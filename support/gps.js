const { Client } = require("@googlemaps/google-maps-services-js");
const async = require("async");
const slugify = require("slugify");

const { getLocations } = require("./mint.js");
const { sleep } = require("./misc");
const logger = require("./logger.js")("gps");

require("dotenv").config();

const { getEvents, updateEvent, saveLocation } = require("./mint");

async function main() {
  const chalk = (await import("chalk").then((mod) => mod)).default;

  logger.info("starting");
  const query =
    "location_empty=true&gmaps_tries=3&ordering=gmaps_tries&limit=100";
  const events = await getEvents(query);

  if (!Array.isArray(events) || !events.length) {
    logger.info("no events to process");
    return;
  }

  logger.info(`events found`, { total: events.length });

  const client = new Client({});

  await async.eachSeries(events, async (event) => {
    await sleep();

    logger.info(`processing event`, {
      pk: event.pk,
      venue: event.venue,
    });

    const slug_venue = slugify(event.venue, { lower: true, strict: true });
    const query = `slug_venue=${slug_venue}`;
    const [location] = await getLocations(query);

    logger.info(`internal location search`, {
      slug_venue,
      location: !!location,
    });

    if (location) {
      logger.info(chalk.green("location found"), { slug: location.slug });
      await updateEvent(event.pk, { gmaps_tries: 1, location_pk: location.pk });
      return;
    }

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
      logger.info(chalk.red(`gps not found`), {
        venue: event.venue,
      });

      await updateEvent(event.pk, { gmaps_tries: 1 });
      return;
    }

    const { formatted_address, geometry, name, place_id } =
      gmapsResponse.data.candidates[0];
    const payload = {
      name,
      address: formatted_address,
      lat: geometry.location.lat.toFixed(6),
      lng: geometry.location.lng.toFixed(6),
      place_id,
      event: event.pk,
      slug_venue,
    };

    const response = await saveLocation(payload);
    if (!response) {
      await updateEvent(event.pk, { gmaps_tries: 1 });
    }
  });
}

main().then(() => {
  logger.info("finished");
  logger.flush();
});
