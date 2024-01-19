const async = require("async");
const { Queue } = require("bullmq");

const { saveEvent } = require("./mint.js");
const { getTransformer, getPaginator } = require("./providers/factories.js");
const { getLinks } = require("./links.js");
const logger = require("./logger.js")("events");

require("dotenv").config();

let queue;

async function extract(url) {
  const response = await fetch(url);

  return await response.text();
}

function transform(html, link) {
  const transformer = getTransformer(link.provider);
  const events = transformer(html, link);

  return events;
}

async function load(events) {
  await async.eachSeries(events, async (payload) => {
    if (queue) {
      await queue.add("event", payload);
      return;
    }

    await saveEvent(payload);
  });
}

async function processLink(link, getPages = true) {
  logger.info(`scrapping event`, { url: link.url, getPages });
  const html = await extract(link.url);
  const events = transform(html, link);
  logger.info(`events found`, { total: events.length });

  await load(events);

  if (getPages) {
    const paginator = getPaginator(link.provider);
    const paginatorLinks = paginator(html, link);
    await etl(paginatorLinks, false);
  }
}

async function etl(links, getPages) {
  await async.eachSeries(links, async (link) => {
    await processLink(link, getPages);
  });
}

async function main() {
  logger.info("starting events");
  const links = getLinks();
  await etl(links);
}

if (require.main === module) {
  main().then(() => {
    logger.info("finished events");
    logger.flush();
  });
} else {
  queue = new Queue("livemusic", {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });
}

module.exports = {
  processLink,
};
