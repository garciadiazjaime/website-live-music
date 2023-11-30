const events = require("../public/events.json");

async function getPageId(eventName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=%27${eventName}%27`;
  const response = await fetch(url);

  const data = await response.json();

  if (!data.query) {
    return;
  }

  const [pageId] = Object.keys(data.query.pages);

  return pageId;
}

async function getDescription(pageId) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=description&pageids=${pageId}&origin=*&format=json`;

  const response = await fetch(url);

  const data = await response.json();

  return data.query.pages[pageId];
}

async function main() {
  const eventName = events[6].name.trim().replace(/ /g, "_");
  console.log({ eventName });

  const pageId = await getPageId(eventName);
  console.log({ pageId });
  if (!pageId) {
    console.log(`no wiki found for: ${eventName}`);
    return;
  }

  const description = await getDescription(pageId);
  console.log({ description });
}

main().then(() => {
  console.log("end");
});
