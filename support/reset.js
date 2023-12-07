const fs = require("fs");
const moment = require("moment");

const { getEvents } = require("./mint");

async function main() {
  console.log("resetting...");

  const today = moment().subtract(1, "days").format("YYYY-MM-DD");

  const query = `gmaps_empty=false&start_date=${today}&ordering=-rank&limit=1000`;

  const events = await getEvents(query);

  fs.writeFileSync(`./public/events.json`, JSON.stringify(events, null, 2));

  console.log(`${events.length} events reset for: ${today}`);
}

main().then(() => console.log("end"));
