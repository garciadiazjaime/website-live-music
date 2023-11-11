const cheerio = require("cheerio");
const fs = require("fs");
const async = require("async");

require("dotenv").config();

const EVENTS_API = process.env.EVENTS_API;

async function extract(url) {
  const response = await fetch(url);

  return await response.text();
}

function transform(html) {
  const $ = cheerio.load(html);

  const data = JSON.parse(
    $('script[type="application/ld+json"]')[1].children[0].data
  );

  const events = data.map((item) => ({
    name: item.name.replace("&amp;", "&"),
    description: item.description
      .replace("&lt;p&gt;", "")
      .replace("&lt;/p&gt;", "")
      .replace("\\n", ""),
    image:
      item.image ||
      "https://cdn.choosechicago.com/uploads/2019/08/placehoder-900x425.jpg",
    url: item.url,
    startDate: item.startDate,
    endDate: item.endDate,
    location: {
      name: item.location.name,
      url: item.location.url,
      address: {
        streetAddress: item.location.address?.streetAddress,
        addressLocality: item.location.address?.addressLocality,
        postalCode: item.location.address?.postalCode,
      },
      telephone: item.location.telephone,
    },
    organizer: {
      name: item.organizer?.name,
    },
  }));

  return events;
}

async function load(events, city, state) {
  fs.writeFileSync("./public/events.json", JSON.stringify(events));

  await async.eachSeries(events, async (event) => {
    const payload = {
      name: event.name,
      description: event.description,
      image: event.image,
      url: event.url,
      start_date: event.startDate,
      end_date: event.endDate,

      location: {
        name: event.location.name,
        url: event.location.url,
        telephone: event.location.telephone,
        address: {
          street: event.location.address?.streetAddress,
          locality: event.location.address?.addressLocality,
          postal: event.location.address?.postalCode,
          city,
          state,
        },
      },
    };

    if (event.organizer?.name) {
      payload.organizer = {
        name: event.organizer.name,
      };
    }

    const response = await fetch(EVENTS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.status !== 201) {
      console.log("Error saving event");
      console.log(payload);
      console.log(data);
    } else {
      console.log(`event saved: ${event.name}`);
    }
  });
}

async function main() {
  const today = new Date();
  console.log("Starting...\n");

  const links = [
    {
      url: `https://www.choosechicago.com/events/list/?tribe-bar-date=${
        today.toJSON().split("T")[0]
      }&tribe_eventcategory[0]=1242`,
      city: "CHICAGO",
      state: "IL",
    },
  ];

  const promises = links.map(async (link) => {
    console.log(`scrapping: ${link.url}`);
    const html = await extract(link.url);
    const events = transform(html);
    console.log(`${events.length} found`);
    load(events, link.city, link.state);
  });

  await Promise.all(promises);
}

main().then(() => console.log("\nFinished!"));
