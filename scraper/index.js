const { Queue } = require("bullmq");

const { getLinks } = require("../support/links.js");

async function main() {
  const myQueue = new Queue("link", {
    connection: {
      host: "localhost",
      port: 6379,
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
