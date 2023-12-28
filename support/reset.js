const fs = require("fs");
const moment = require("moment");

const { getEvents, getArtistMetadata } = require("./mint");
const logger = require("./logger.js")("reset");

async function resetEvents() {
  const today = moment().subtract(1, "days").format("YYYY-MM-DD");

  const query = `location_empty=false&start_date=${today}&ordering=-rank&limit=1000`;

  const events = await getEvents(query);

  fs.writeFileSync(`./public/events.json`, JSON.stringify(events, null, 2));

  logger.info(`events reset for`, {
    total: events.length,
    date: today,
  });
}

async function resetArtist() {
  const today = moment().subtract(1, "days").format("YYYY-MM-DD");

  const query = ``;

  const artists = await getArtistMetadata(query);

  fs.writeFileSync(
    `./public/artist_metadata.json`,
    JSON.stringify(artists, null, 2)
  );

  const genres = artists.reduce((accu, artist) => {
    artist.metadata.spotify?.genres?.forEach(({ name }) => {
      if (!accu[name]) {
        accu[name] = {
          total: 0,
        };
      }

      accu[name].total += 1;
    });

    return accu;
  }, {});
  console.log(genres);

  logger.info(`artists reset`, {
    total: artists.length,
    date: today,
  });
}

async function main() {
  logger.info("reset starting");

  await resetEvents();

  await resetArtist();
}

main().then(() => {
  logger.info("reset end");
  logger.flush;
});
