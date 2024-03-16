const fs = require("fs");
const moment = require("moment");

const { getEvents } = require("./mint");
const logger = require("./logger.js")("reset");

async function resetEvents() {
  const today = moment().subtract(1, "days").format("YYYY-MM-DD");
  const nextWeek = moment().add(8, "days").format("YYYY-MM-DD");

  const query = `location_empty=false&start_date=${today}&end_date=${nextWeek}&ordering=-rank&limit=700`;

  const events = await getEvents(query);

  fs.writeFileSync(`./public/events.json`, JSON.stringify(events, null, 2));

  logger.info(`events reset for`, {
    total: events.length,
    date: today,
  });
}

async function main() {
  logger.info("reset starting");

  await resetEvents();
}

main().then(() => {
  logger.info("reset end");
  logger.flush;
});
