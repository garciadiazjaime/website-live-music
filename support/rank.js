const moment = require("moment");

const { rankEvents } = require("./mint");

async function main() {
  console.log("rank...");

  const start_date = moment().subtract(7, "days");

  await rankEvents({
    start_date,
  });
}

main().then(() => console.log("end"));
