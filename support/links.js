const moment = require("moment");
const { program } = require('commander');

function getLinks() {
  program.option('-p, --provider [providers...]', 'Event provider list (e.g. CHOOSECHICAGO, SONGKICK)');
  program.option('-c, --city [cities...]', 'Event cities (e.g. CHICAGO, TIJUANA)');
  program.option('-l --limit <number>', 'Results limit (default: no limit)');
  program.parse();
  const options = program.opts();

  const today = moment();
  const endDate = moment().add(7, "days");
  const providerLinks = [
    {
      url: `https://www.choosechicago.com/events/?tribe-bar-date=${today.format(
        "YYYY-M-D"
      )}&tribe_eventcategory[0]=1242`,
      city: "CHICAGO",
      provider: "CHOOSECHICAGO",
    },
    {
      url: `https://www.songkick.com/metro-areas/9426-us-chicago?filters[minDate]=${today.format(
        "M/D/YYYY"
      )}&filters[maxDate]=${endDate.format("M/D/YYYY")}`,
      city: "CHICAGO",
      provider: "SONGKICK",
    },
  ];

  return providerLinks
    .filter((link) => (options.provider ? options.provider.includes(link.provider) : true))
    .filter((link) => (options.city ? options.city.includes(link.city) : true))
    .slice(0, options.limit);
}

module.exports = { getLinks };
