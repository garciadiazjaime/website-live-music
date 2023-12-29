const { Worker } = require("bullmq");

const { processLink } = require("../support/events");

async function main() {
  const worker = new Worker(
    "link",
    async (job) => {
      if (job.name === "link") {
        await processLink(job.data);
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
