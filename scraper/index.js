const { Queue } = require("bullmq");

const { getLinks } = require("../support/links.js");

require("dotenv").config();

async function main() {
  const myQueue = new Queue("event", {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  const links = getLinks();

  const promises = links.map(async (link) => {
    await myQueue.add("link", link);
  });

  await Promise.all(promises);
}

main().then(() => {
  console.log("end");
  process.exit(1);
});
