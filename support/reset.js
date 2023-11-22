const fs = require("fs");

const { getEvents } = require("./mint");

async function main() {
  console.log("resetting...");

  const today = new Date().toJSON().split("T")[0];
  const query = `gmaps_empty=false&start_date=${today}`;
  const events = await getEvents(query);

  fs.writeFileSync(`./public/events.json`, JSON.stringify(events, null, 2));

  console.log(`${events.length} events reset for: ${today}`);
}

main().then(() => console.log("end"));
