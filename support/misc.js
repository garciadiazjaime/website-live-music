const sleep = async (ms = 1_000) => {
  console.log(`\nsleeping for ${ms / 1000} secs\n`);
  await new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  sleep,
};
