const fs = require("fs");
const moment = require("moment");

const { getEvents, getArtistMetadata } = require("./mint");
const logger = require("./logger.js")("reset");
const genres = require("../public/genres.json");

async function resetEvents() {
  const today = moment().subtract(1, "days").format("YYYY-MM-DD");
  const nextWeek = moment().add(8, "days").format("YYYY-MM-DD");

  const query = `location_empty=false&start_date=${today}&end_date=${nextWeek}&ordering=-rank&limit=700`;

  const events = await getEvents(query);

  fs.writeFileSync(`./public/events.json`, JSON.stringify(events, null, 2));

  logger.info(`events reset for`, {
    total: events.length,
    date: today,
  });
}

async function resetArtist() {
  const today = moment().subtract(1, "days").format("YYYY-MM-DD");

  const query = `limit=100`;

  const artists = await getArtistMetadata(query);

  const genresSummary = artists.reduce(
    (accu, artist) => {
      if (!accu.artists[artist.pk]) {
        accu.artists.raw[artist.pk] = {
          pk: artist.pk,
          name: artist.name,
          image: artist.metadata.image,
          disabled: false,

          genres: {
            nodes: artist.spotify?.genres.map(({ name }) => name),
            parents: [],
          },
        };
      }

      artist.spotify?.genres?.forEach(({ name }) => {
        const _genre = name.toLowerCase();
        const parent = genres.nodes[_genre];
        if (!parent) {
          console.log("parent not found", _genre);
          return;
        }

        if (!accu.parent.raw[parent]) {
          accu.parent.raw[parent] = 0;
        }

        accu.parent.raw[parent] += 1;

        if (!accu.artists.raw[artist.pk].genres.parents.includes(parent)) {
          accu.artists.raw[artist.pk].genres.parents.push(parent);
        }
      });

      return accu;
    },
    { parent: { raw: {}, sort: {} }, artists: { raw: {}, sort: {} } }
  );

  genresSummary.parent.sort = Object.entries(genresSummary.parent.raw)
    .reduce((accu, [key, value]) => {
      accu.push([key, value]);
      return accu;
    }, [])
    .sort((a, b) => b[1] - a[1]);

  genresSummary.artists.sort = Object.values(genresSummary.artists.raw).reduce(
    (accu, value) => {
      accu.push(value);
      return accu;
    },
    []
  );

  fs.writeFileSync(
    `./public/genre_summary.json`,
    JSON.stringify(genresSummary, null, 2)
  );

  logger.info(`artists reset`, {
    total: artists.length,
    date: today,
  });
}

async function main() {
  logger.info("reset starting");

  await resetEvents();
}

main().then(() => {
  logger.info("reset end");
  logger.flush;
});
