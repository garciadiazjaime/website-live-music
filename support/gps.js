const { Client } = require("@googlemaps/google-maps-services-js");

require("dotenv").config();

const { pbcopy } = require("./keyboard");

const events = require("../public/events.json");

async function askGPT() {
  const addresses = events
    .slice(0, 1)
    .map(
      (item, index) =>
        `${item.location.name} with address: ${item.location.address.streetAddress}, ${item.location.address.addressLocality}, ${item.location.address.postalCode}`
    );
  const prompt = `coordinates and nothing else for: ${addresses.join("\n")}.`;

  pbcopy(prompt);
  console.log("GPS prompt copied");
  console.log("ask GPT");
}

async function main() {
  console.log("starting: gps");

  const client = new Client({});

  const event = events[0];
  const params = {
    input: event.location.name,
    inputtype: "textquery",
    key: process.env.GOOGLE_MAPS_API_KEY,
    fields: ["place_id", "name", "formatted_address", "geometry"],
    locationbias: "41.8336152,-87.8967663,1000",
  };

  client
    .findPlaceFromText({ params })
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
      console.log(error);
    });
}

main().then(() => {
  console.log("end");
});
