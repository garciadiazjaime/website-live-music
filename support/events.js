const async = require("async");
const moment = require("moment"); // require
const { TransformerFactory } = require("./transformers/transformerFactory.js"); // require


require("dotenv").config();

const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API;

async function extract(url) {
  const response = await fetch(url);

  return await response.text();
}

function transform(html, link) {
  const transformerFactory = new TransformerFactory();
  const transformer = transformerFactory.getTransformer(link.provider);
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
  const today = moment().format("YYYY-M-D");
  const links = [
    {
      url: `https://www.choosechicago.com/events/?tribe-bar-date=${today}&tribe_eventcategory[0]=1242`,
      city: "CHICAGO",
      state: "IL",
      provider: "CHOOSECHICAGO"
    },
  ];

  const promises = links.map(async (link) => {
    console.log(`scrapping: ${link.url}`);
    const html = await extract(link.url);

    const events = transform(html, link);
    console.log(`${events.length} found`);

    await load(events);
  });

  await Promise.all(promises);
}

main().then(() => console.log("\nFinished!"));
