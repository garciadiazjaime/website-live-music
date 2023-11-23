const cheerio = require("cheerio");
const moment = require("moment");

function SongkickTransformer(html, link) {
  const $ = cheerio.load(html);
  const providerUrl = new URL(link.url);

  const events = $(".event-listings-element")
    .toArray()
    .map((item) => {
      const name = $(item).find(".artists strong").text();
      const image = `https:${$(item).find(".artist-profile-image").data("src")}`;
      const url = `${providerUrl.origin}${$(item).find(".event-link").attr("href")}`;
      const venueName = $(item).find(".venue-link").text();
      const timestamp = $(item).find("time").attr("datetime");
      const start_date = moment(timestamp).format();

      return {
        name,
        image,
        url,
        start_date,
        end_date: start_date,
        location: {
          name: venueName,
          city: link.city,
          state: link.state,
        },
      };
    });

  return events;
}

module.exports = { SongkickTransformer };
