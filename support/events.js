const async = require("async");
const moment = require("moment");

const { saveEvent } = require("./mint.js");
const { getTransformer, getPaginator } = require("./providers/factories.js");
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
  const today = moment();
  const endDate = moment().add(7, "days");
  const links = [
    {
      url: `https://www.choosechicago.com/events/?tribe-bar-date=${today.format(
        "YYYY-M-D"
      )}&tribe_eventcategory[0]=1242`,
      city: "CHICAGO",
      provider: "CHOOSECHICAGO",
    },
    {
      url: `https://www.songkick.com/metro-areas/9426-us-chicago?filters[minDate]=${today.format(
        "M/D/YYYY"
      )}&filters[maxDate]=${endDate.format("M/D/YYYY")}`,
      city: "CHICAGO",
      provider: "SONGKICK",
    },
  ];

  await etl(links);
}

main().then(() => {
  logger.info("finished events");
  logger.flush();
});
