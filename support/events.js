const async = require("async");
const moment = require("moment");
const { getTransformer, getPaginator } = require("./providers/factories.js");
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
  await async.eachSeries(events, async (event) => {
    const response = await fetch(`${EVENTS_API}/events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    const data = await response.json();
    if (response.status !== 201) {
      console.log("Error saving event");
      console.log(event);
      console.log(data);
    } else {
      console.log(`event saved: ${event.name}`);
    }
  });
}

async function main() {
  console.log("starting...\n");
  const today = moment();
  const endDate = moment().add(7, 'days');
  const links = [
    {
      url: `https://www.choosechicago.com/events/?tribe-bar-date=${today.format("YYYY-M-D")}&tribe_eventcategory[0]=1242`,
      city: "CHICAGO",
      state: "IL",
      provider: "CHOOSECHICAGO"
    },
    {
      url: `https://www.songkick.com/metro-areas/9426-us-chicago?filters[minDate]=${today.format("M/D/YYYY")}&filters[maxDate]=${endDate.format("M/D/YYYY")}`,
      city: "CHICAGO",
      state: "IL",
      provider: "SONGKICK"
    },
  ];

  await etl(links);
}

async function etl(links, getPages = true) {
  await async.eachSeries(links, async (link) => {
    console.log(`scrapping: ${link.url}, getPages: ${getPages}`);
    const html = await extract(link.url);
    const events = transform(html, link);
    console.log(`${events.length} found`);

    await load(events);

    if (getPages) {
      const paginator = getPaginator(link.provider);
      const paginatorLinks = paginator(html, link);
      await etl(paginatorLinks, false);
    }
  });
}

main().then(() => console.log("\nFinished!"));
