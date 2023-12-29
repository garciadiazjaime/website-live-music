const { Worker } = require("bullmq");

const { processLink } = require("../support/events");

async function main() {
  const worker = new Worker(
    "event",
    async (job) => {
      console.log(job.name, job.data);
      if (job.name === "link") {
        await processLink(job.data);
        return;
      }

      if (job.name === "event") {
        if (job.data.provider === "CHOOSECHICAGO") {
          // todo: get location, get location metadata, save event & location & metadata
        }
      }
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
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
