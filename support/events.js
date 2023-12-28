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

async function etl(links, getPages = true) {
  await async.eachSeries(links, async (link) => {
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
  });
}

async function main() {
  logger.info("starting events");
  const links = getLinks();
  await etl(links);
}

main().then(() => {
  logger.info("finished events");
  logger.flush();
});
