const fs = require("fs");

const events = require("../public/events.json");

const TOP_EVENTS_LIMIT = 3;
const TOP_EVENTS_FILE_PATH = "tmp/topEvents.txt";

function pbcopy(data) {
  const proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
}

function getTopEvents() {
  const response = fs.readFileSync(TOP_EVENTS_FILE_PATH, "utf8");
  if (!response) {
    const titles = events.map((item, index) => `[${index + 1}] ${item.name}`);
    const prompt = `Which of following music events are the top ${TOP_EVENTS_LIMIT}? provide just the reference number, nothing else \n${titles.join(
      "\n"
    )}`;

    pbcopy(prompt);
    console.log(`Top Events prompt copied`);

    return;
  }

  const indexes = response
    .slice(response.indexOf(":"))
    .match(/\d+/g)
    .map((item) => parseInt(item));

  const topEvents = indexes.map((index) => events[index - 1]);

  return topEvents;
}

async function main() {
  console.log("starting: movie script");

  const topEvents = getTopEvents();

  if (!topEvents) {
    console.log(`ask GPT and saved answer in: ${TOP_EVENTS_FILE_PATH}`);
    return;
  }

  const titles = topEvents.map((item, index) => `- ${item.name}`);
  const prompt = `Write the text for an ad inviting people from chicago to the following events, make it fun and snappy. Aim for 30 seconds:\n\n${titles.join(
    "\n"
  )}`;

  pbcopy(prompt);
  console.log("Movie Script prompt copied");
  console.log("ask GPT and create the video");

  fs.truncateSync(TOP_EVENTS_FILE_PATH, 0);
}

main().then(() => {
  console.log("end");
});
