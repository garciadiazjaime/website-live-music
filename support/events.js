const async = require("async");
const moment = require("moment");

const { getTransformer, getPaginator } = require("./providers/factories.js");
const logger = require("./logger.js")("events");
require("dotenv").config();

const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API;

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
    const response = await fetch(`${EVENTS_API}/events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.status > 201) {
      logger.info("Error saving event", { payload, data });
      return;
    }

    logger.info(`event saved`, data.slug);
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

main().then(() => {
  logger.info("finished events");
  logger.flush();
});
