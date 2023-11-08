const cheerio = require("cheerio");
const fs = require("fs");

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

const load = (events) =>
  fs.writeFileSync("./public/events.json", JSON.stringify(events));

async function main() {
  const today = new Date();
  console.log("Starting...\n");

  const links = [
    {
      url: `https://www.choosechicago.com/events/list/?tribe-bar-date=${
        today.toJSON().split("T")[0]
      }&tribe_eventcategory[0]=1242`,
    },
  ];

  const promises = links.map(async (link) => {
    console.log(`scrapping: ${link.url}`);
    const html = await extract(link.url);
    const events = transform(html);
    console.log(`${events.length} found`);
    load(events);
  });

  await Promise.all(promises);
}

main().then(() => console.log("\nFinished!"));
