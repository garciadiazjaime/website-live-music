const cheerio = require("cheerio");
const async = require("async");
const moment = require("moment");

const { getMetadata } = require("../metadata");
const { getGMapsLocation } = require("../gps");
const { getSpotify } = require("../spotify");
const { saveEvent } = require("../mint");
const { getSocialNetworkFrom } = require("../misc");
const { getArtistSingle } = require("../artist");
const logger = require("../logger.js")("SCHUBAS_TAVERN");

async function extract(url) {
  logger.info("scrapping", { url });
  const response = await fetch(url);
  const html = await response.text();

  return html;
}

function transform(html, preEvent) {
  const $ = cheerio.load(html);
  const regexTime = /(1[0-2]|0?[1-9]):([0-5][0-9])\s?([AaPp][Mm])/;

  const events = $(".tessera-card-deck .card")
    .toArray()
    .map((item) => {
      const name = $(item).find(".card-title").text().trim();
      const url = $(item).find(".card-body a").attr("href");
      const image = $(item).find(".card-header img").attr("src");
      const date = $(item).find(".date").text().trim();
      const time = $(item)
        .find(".tessera-doorsTime")
        .text()
        .trim()
        .match(regexTime)?.[0]
        .replace(" ", "");

      const dateTime = `${date} ${time}`;

      const start_date = moment(dateTime, "MMM DD h:mma");
      const description = $(item)
        .find(".show-details")
        .text()
        .trim()
        .replace(/(\r\n|\n|\r)+/gm, "")
        .replace(/(\s)+/g, " ");
      const buyUrl = url;

      const provider = preEvent.provider;
      const venue = preEvent.venue;
      const city = preEvent.city;

      const event = {
        name,
        image,
        url,
        start_date,
        description,
        provider,
        venue,
        city,
        buyUrl,
      };

      return event;
    });

  return events;
}

function transformDetails(html) {
  const $ = cheerio.load(html);

  const artists = $(".tessera-artists h2 a")
    .toArray()
    .map((item) => {
      const name = $(item).text().trim();
      const link = $(item).attr("href");
      const socialNetwork = getSocialNetworkFrom(link);
      const artist = {
        name,
        metadata: {
          ...socialNetwork,
        },
      };

      return artist;
    });

  const extraLinks = $(".about-show iframe")
    .toArray()
    .map((item) => $(item).attr("src"));

  if (artists.length === extraLinks.length) {
    artists.forEach((artist, index) => {
      const socialNetwork = getSocialNetworkFrom(extraLinks[index]);
      if (!socialNetwork) {
        return;
      }

      const [prop, network] = Object.entries(socialNetwork)[0];
      artist.metadata[prop] = network;
    });
  } else {
    logger.info(`NO_EXTRA_LINKS`, { artists, extraLinks });
  }

  const details = {
    artists,
  };

  return details;
}

async function getDetails(url) {
  if (!url) {
    return;
  }

  const html = await extract(url);

  const details = transformDetails(html);

  const response = {
    artists: [],
  };

  await async.eachSeries(details.artists, async (preArtist) => {
    const artistSingle = await getArtistSingle(preArtist.name);

    if (!artistSingle) {
      return;
    }

    const artist = {
      name: preArtist.name || artistSingle.name,
      profile: artistSingle.profile,
      genres: artistSingle.genres,
      metadata: {
        image: artistSingle.metadata?.image,
        website: artistSingle.metadata?.website || preArtist.metadata.website,
        twitter: artistSingle.metadata?.twitter || preArtist.metadata.twitter,
        facebook:
          artistSingle.metadata?.facebook || preArtist.metadata.facebook,
        youtube: artistSingle.metadata?.youtube || preArtist.metadata.youtube,
        instagram:
          artistSingle.metadata?.instagram || preArtist.metadata.instagram,
        tiktok: artistSingle.metadata?.tiktok || preArtist.metadata.tiktok,
        soundcloud:
          artistSingle.metadata?.soundcloud || preArtist.metadata.soundcloud,
        spotify: artistSingle.metadata?.spotify || preArtist.metadata.spotify,
        appleMusic:
          artistSingle.metadata?.appleMusic || preArtist.metadata.appleMusic,
        band_camp:
          artistSingle.metadata?.band_camp || preArtist.metadata.bandcamp,
      },
    };

    const spotify = await getSpotify(artist);
    if (spotify) {
      artist.spotify = spotify;
    }

    response.artists.push(artist);
  });

  return response;
}

async function main() {
  // todo: headless browser might be able to pull price
  const url = "https://lh-st.com/";
  const preEvent = {
    venue: "Schubas Tavern",
    provider: "SCHUBAS_TAVERN",
    city: "Chicago",
  };
  const location = await getGMapsLocation(preEvent);

  if (!location.website?.includes("lh-st.com")) {
    logger.error("ERROR_WEBSITE", { url, maps: location.website });
  }

  if (!location.metadata) {
    const locationMetadata = await getMetadata(url);
    location.metadata = locationMetadata;
  }

  const html = await extract(url);

  const preEvents = transform(html, preEvent);

  await async.eachSeries(preEvents, async (preEvent) => {
    const details = await getDetails(preEvent.url);

    const event = { ...preEvent, ...details, location };
    console.log(JSON.stringify(event, null, 2));
    await saveEvent(event);
  });
}

main().then(() => {
  console.log("end");
});
