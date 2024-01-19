const { Worker } = require("bullmq");

const { processLink } = require("../support/events");
const { getGPS } = require("../support/gps");
const { getMetadata } = require("../support/metadata");

require("dotenv").config();

async function main() {
  const worker = new Worker(
    "livemusic",
    async (job) => {
      console.log("job", job.name, job.data);
      if (job.name === "link") {
        await processLink(job.data);
        return;
      }

      if (job.name === "event") {
        if (job.data.provider === "SONGKICK") {
          const gps = await getGPS(job.data);
          console.log({ gps });
          if (!gps) {
            return;
          }

          const locationMetadata = await getMetadata(gps.website);
          console.log({ locationMetadata });
          // save event & location & metadata
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

  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });
}

main().then(() => {
  console.log("queue started");
});
