const fs = require("fs");
const moment = require("moment");

const { getEvents } = require("./mint");
const logger = require("./logger.js")("reset");

async function main() {
  logger.info("reset starting");

  const today = moment().subtract(1, "days").format("YYYY-MM-DD");

  const query = `gmaps_empty=false&start_date=${today}&ordering=-rank&limit=1000`;

  const events = await getEvents(query);

  fs.writeFileSync(`./public/events.json`, JSON.stringify(events, null, 2));

  logger.info(`events reset for`, {
    total: events.length,
    date: today,
  });
}

main().then(() => {
  logger.info("reset end");
  logger.flush;
});
