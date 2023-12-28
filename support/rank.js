const moment = require("moment");

const { rankEvents } = require("./mint");
const logger = require("./logger.js")("rank");

async function main() {
  logger.info("rank starting");

  const start_date = moment().subtract(7, "days");

  await rankEvents({
    start_date,
  });
}

main().then(() => {
  logger.info("finished rank");
  logger.flush();
});
