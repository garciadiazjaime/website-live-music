const { Client } = require("@googlemaps/google-maps-services-js");
const async = require("async");
const slugify = require("slugify");

const { getLocations } = require("./mint.js");
const { sleep } = require("./misc");
const logger = require("./logger.js")("gps");

require("dotenv").config();

const { getEvents, updateEvent, saveLocation } = require("./mint");

async function getGPS(event) {
  const chalk = (await import("chalk").then((mod) => mod)).default;

  logger.info(`processing`, {
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
    logger.info(chalk.green("location found"), {
      slug: location.slug,
      website: location.website,
    });

    return location;
  }

  const params = {
    input: event.venue,
    inputtype: "textquery",
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    fields: ["place_id", "name", "formatted_address", "geometry"],
    locationbias: "circle:30000@41.8336152,-87.8967663",
  };

  await sleep();

  const client = new Client({});

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

    return;
  }

  const { formatted_address, geometry, name, place_id } =
    gmapsResponse.data.candidates[0];

  const paramsDetails = {
    place_id,
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    fields: ["website"],
  };
  const detailsResponse = await client.placeDetails({
    params: paramsDetails,
  });

  const { website } = detailsResponse.data.result;
  logger.info("website found", { website });

  const payload = {
    name,
    address: formatted_address,
    lat: geometry.location.lat.toFixed(6),
    lng: geometry.location.lng.toFixed(6),
    place_id,
    slug_venue,
    website,
  };

  return payload;
}

async function main() {
  logger.info("starting");
  const query =
    "location_empty=true&gmaps_tries=3&ordering=gmaps_tries&limit=100";
  const events = await getEvents(query);

  if (!Array.isArray(events) || !events.length) {
    logger.info("no events to process");
    return;
  }

  logger.info(`events found`, { total: events.length });

  await async.eachSeries(events, async (event) => {
    const chalk = (await import("chalk").then((mod) => mod)).default;

    const location = await getGPS(event);

    if (location.pk) {
      logger.info(chalk.green("location found"), {
        slug: location.slug,
        website: location.website,
      });
      await updateEvent(event.pk, { gmaps_tries: 1, location_pk: location.pk });
      return;
    }

    if (!location) {
      logger.info(chalk.red(`gps not found`), {
        venue: event.venue,
      });

      await updateEvent(event.pk, { gmaps_tries: 1 });
      return;
    }

    const response = await saveLocation({
      ...location,
      event: event.pk,
    });
    if (!response) {
      await updateEvent(event.pk, { gmaps_tries: 1 });
    }
  });
}

if (require.main === module) {
  main().then(() => {
    logger.info("finished");
    logger.flush();
  });
}

module.exports = {
  getGPS,
};
