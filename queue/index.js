const { Worker } = require("bullmq");
const async = require("async");

const { processLink } = require("../support/events");
const { getGPS } = require("../support/gps");
const { getMetadata } = require("../support/metadata");
const { getArtist } = require("../support/artist");
const { getSpotify } = require("../support/spotify");
const { saveProcessedEvent } = require("../support/mint");
const logger = require("../support/logger")("queue");

require("dotenv").config();

async function main() {
  const worker = new Worker(
    "livemusic",
    async (job) => {
      console.log("__job__", job.name, job.data);
      if (job.name === "link") {
        await processLink(job.data);
        return;
      }

      if (job.name === "event") {
        if (job.data.provider === "SONGKICK") {
          const location = await getGPS(job.data);

          if (!location) {
            logger.info("no-location", job.data);
            return;
          }

          if (!location.metadata) {
            const locationMetadata = await getMetadata(location.website);
            location.metadata = locationMetadata;
          }

          const artists = await getArtist(job.data);

          await async.eachSeries(artists, async (artist) => {
            const spotify = await getSpotify(artist);
            artist.spotify = spotify;
          });

          const event = {
            ...job.data,
            location,
            artists,
          };

          console.log(JSON.stringify(event, null, 2));
          await saveProcessedEvent(event);
        }
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    }
  );

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed`);
    console.log(err);
  });
}

main().then(() => {
  console.log("queue started");
});
