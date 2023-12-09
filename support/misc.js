const logger = require("./logger.js")("misc");

const sleep = async (ms = 1_000) => {
  logger.info(`sleeping`, {
    seconds: ms / 1000,
  });

  await new Promise((resolve) => setTimeout(resolve, ms));
};

const snakeCase = (value) => value.trim().replace(/ /g, "_");

module.exports = {
  sleep,
  snakeCase,
};
