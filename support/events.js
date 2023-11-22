const cheerio = require("cheerio");
const async = require("async");
const moment = require("moment"); // require

require("dotenv").config();

const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API;

async function extract(url) {
  const response = await fetch(url);

  return await response.text();
}

function transform(html, site) {
  const $ = cheerio.load(html);

  const events = $(".type-tribe_events")
    .toArray()
    .map((item) => {
      const name = $(item).find(".card-title").text();
      const description = $(item).find(".card-body p").text();
      const image = $(item).find(".img-cover").data("src");
      const url = $(item).find(".card-img-link").attr("href");

      const date = $(item).find(".tribe-event-date-start").text();
      const startTime = $(item).find(".tribe-event-time").text();
      const endTime = $(item).find(".tribe-event-time").last().text();
      const start_date = moment(
        `${date} ${startTime}`,
        "dddd, MMMM Do LT"
      ).format();
      const end_date = moment(
        `${date} ${endTime}`,
        "dddd, MMMM Do LT"
      ).format();

      const addressName = $(item)
        .find(".tribe-events-venue-details b")
        .text()
        .split(",")[0];
      const address = $(item).find(".tribe-events-venue-details");
      address.find("b").remove();

      return {
        name,
        description,
        image,
        url,
        start_date,
        end_date,
        location: {
          name: addressName,
          address: address.text(),
          city: site.city,
          state: site.state,
        },
      };
    });

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
