const cheerio = require("cheerio");
const async = require("async");
const moment = require("moment");

const { getMetadata } = require("../metadata.js");
const { getGMapsLocation } = require("../gps.js");
const { getSpotify } = require("../spotify.js");
const { saveEvent } = require("../mint.js");
const { getArtistSingle } = require("../artist.js");
const logger = require("../logger.js")("THALIA_HALL");

async function extract(url) {
  logger.info("scrapping", { url });
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data;
}

function transform(data, location) {
  const events = data._embedded?.events.map((event) => {
    return {
      name: event.name,
      image: event.images[0]?.url,
      url: event.url,
      start_date: event.dates.start?.dateTime,
      description: event.info,
      buyUrl: event.url,
      price: event.priceRanges?.[0].min,
      artists: event._embedded.attractions?.map((artist) => {
        console.log(Object.keys(artist.externalLinks ?? {}));
        const metadata = artist.externalLinks
          ? {
              youtube: artist.externalLinks.youtube?.[0].url,
              twitter: artist.externalLinks.twitter?.[0].url,
              appleMusic: artist.externalLinks.itunes?.[0].url,
              facebook: artist.externalLinks.facebook?.[0].url,
              spotify: artist.externalLinks.spotify?.[0].url,
              instagram: artist.externalLinks.instagram?.[0].url,
              website: artist.externalLinks.homepage?.[0].url,
              wiki: artist.externalLinks.wiki?.[0].url,
              musicbrainz: artist.musicbrainz.wiki?.[0].url,
              lastfm: artist.lastfm.wiki?.[0].url,
            }
          : {};

        if (artist.images?.[0]) {
          metadata.image = artist.images?.[0].url;
        }

        const genres = artist.classifications
          ? artist.classifications?.[0].genre.name
          : undefined;

        return {
          name: artist.name,
          ticketmaster: {
            id: artist.id,
            url: artist.url,
          },
          genres,
          metadata,
        };
      }),
      provider: location.provider,
      venue: location.venue,
      city: location.city,
    };
  });

  return events;
}

async function getArtists(event) {
  const artists = [];

  await async.eachSeries(event.artists, async (preArtist) => {
    console.log({ preArtist });
    const artist = await getArtistSingle(preArtist.name);

    if (!artist) {
      return preArtist;
    }

    // consolidate artist (musicbrainz + website) with ticketmaster

    const spotify = await getSpotify(artist);
    if (spotify) {
      artist.spotify = spotify;
    }

    artists.push(artist);
  });

  return artists;
}

async function main() {
  const preLocation = {
    venue: "Thalia Hall",
    provider: "THALIA_HALL",
    city: "Chicago",
    website: "https://www.thaliahallchicago.com/",
  };
  const location = await getGMapsLocation(preLocation);

  if (!location.website?.includes("thaliahallchicago.com")) {
    logger.error("ERROR_WEBSITE", {
      website: preLocation.website,
      maps: location.website,
    });
  }

  if (!location.metadata) {
    const locationMetadata = await getMetadata(preLocation.website);
    location.metadata = locationMetadata;
  }
  // todo: this api-key might expire

  const html = await extract(
    "https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=Mj9g4ZY7tXTmixNb7zMOAP85WPGAfFL8&venueId=rZ7HnEZ17aJq7&venueId=KovZpZAktlaA"
  );

  const preEvents = transform(html, preLocation).slice(0, 1);
  console.log(JSON.stringify(preEvents, null, 2));

  await async.eachSeries(preEvents, async (preEvent) => {
    const artists = await getArtists(preEvent);

    const event = { ...preEvent, artists, location };
    console.log(JSON.stringify(event, null, 2));
    // await saveEvent(event);
  });
}

main().then(() => {
  console.log("end");
});
