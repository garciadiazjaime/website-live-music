// const { Logtail } = require("@logtail/node");

// require("dotenv").config();

// const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

function logger(reference) {
  return {
    info: (msg, payload) => {
      const data = [reference, msg, payload];
      console.table(data);
      // logtail.info(`${reference}:${msg}`, payload);
    },
    error: (msg) => {
      console.table({ reference, msg });
      // logtail.error(reference, msg);
    },
    flush: () => {
      // logtail.flush();
    },
  };
}

module.exports = logger;
