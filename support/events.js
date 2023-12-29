const async = require("async");

const { saveEvent } = require("./mint.js");
const { getTransformer, getPaginator } = require("./providers/factories.js");
const { getLinks } = require("./links.js");
const logger = require("./logger.js")("events");

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

async function etl(links) {
  await async.eachSeries(links, async (link) => {
    await processLink(link);
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
}

module.exports = {
  processLink,
};
