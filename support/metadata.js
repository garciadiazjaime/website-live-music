const cheerio = require("cheerio");
const async = require("async");
require("dotenv").config();

const logger = require("./logger.js")("metadata");

const {
  getArtists,
  saveArtistMetadata,
  updateArtist,
  getLocations,
  saveLocationMetadata,
  updateLocationRetries,
} = require("./mint");
const { snakeCase } = require("./misc");

async function getPageId(artistName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=%27${artistName}%27`;
  logger.info(`getting pageId`, { url });
  const response = await fetch(url);

  const data = await response.json();

  if (!data.query) {
    return;
  }

  const [pageId] = Object.keys(data.query.pages);

  return pageId;
}

async function getWikiData(pageId) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=description&pageids=${pageId}&origin=*&format=json`;
  logger.info(`getting description`, { url });

  const response = await fetch(url);

  const data = await response.json();

  const description = data.query.pages[pageId];

  return {
    wiki_title: description?.title,
    wiki_description: description?.description,
  };
}

async function getWebsite(pageId) {
  const url = `https://en.wikipedia.org/wiki?curid=${pageId}`;
  logger.info(`getting website`, { url });

  const response = await fetch(url);

  const html = await response.text();

  const $ = cheerio.load(html);

  const website = $(".official-website a").attr("href");

  if (website) {
    return website;
  }

  return $(".infobox.vcard.plainlist .external.text").attr("href");
}

const twitterRegex = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/gi;
const facebookRegex =
  /http(?:s)?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/gi;
const youtubeRegex = /http(?:s)?:\/\/(?:www\.)?youtube\.com\/([a-zA-Z0-9_]+)/gi;
const instagramRegex =
  /http(?:s)?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_]+)/gi;
const tiktokRegex = /http(?:s)?:\/\/(?:www\.)?tiktok\.com\/([a-zA-Z0-9_]+)/gi;
const soundcloudRegex =
  /http(?:s)?:\/\/(?:www\.)?soundcloud\.com\/([a-zA-Z0-9_]+)/gi;
const spotifyRegex =
  /https?:\/\/open\.spotify\.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|)/gi;
const appleMusicRegex =
  /https?:\/\/music\.apple\.com\/([a-zA-Z]{2})\/(album|artist|playlist|station)\/([a-zA-Z0-9_-]+)\/(\d+)/gi;
const emailRegex = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
const emailValidRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const urlValidRegex =
  /https?:\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,})(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?/i;

async function getArtistMetadata(website) {
  if (!website) {
    return;
  }
  logger.info(`getting artist metadata`, { website });
  const response = await fetch(website).catch((error) => logger.error(error));
  if (!response) {
    return;
  }

  const html = await response.text();

  const twitter = html.match(twitterRegex)?.pop();
  const facebook = html.match(facebookRegex)?.pop();
  const youtube = html.match(youtubeRegex)?.pop();
  const instagram = html.match(instagramRegex)?.pop();
  const tiktok = html.match(tiktokRegex)?.pop();
  const email = html.match(emailRegex)?.pop();
  const spotify = html.match(spotifyRegex)?.pop();
  const appleMusic = html.match(appleMusicRegex)?.pop();
  const soundcloud = html.match(soundcloudRegex)?.pop();

  const $ = cheerio.load(html);
  const title =
    $('[property="og:title"]').attr("content") ||
    $('[property="twitter:title"]').attr("content");
  const description =
    $('[property="og:description"]').attr("content") ||
    $('[property="twitter:description"]').attr("content");
  const type =
    $('[property="og:type"]').attr("content") ||
    $('[property="twitter:title"]').attr("content");
  let image =
    $('[property="og:image"]').attr("content") ||
    $('[property="twitter:image"]').attr("content");
  if (image?.[0] === "/") {
    image = `${website}${image}`;
  }

  return {
    twitter,
    facebook:
      facebook !== "http://www.facebook.com/2008" ? facebook : undefined,
    youtube,
    instagram,
    tiktok,
    soundcloud,
    spotify: urlValidRegex.test(spotify) ? spotify : undefined,
    appleMusic,
    email: emailValidRegex.test(email) ? email : undefined,

    title,
    description,
    type,
    image,
  };
}

async function processArtists(query) {
  const artists = await getArtists(query);
  logger.info(`artists found`, { total: artists.length });
  let index = 0;

  await async.eachSeries(artists, async (artist) => {
    index += 1;

    const artistName = snakeCase(artist.name);

    logger.info(`processing artist`, {
      index,
      total: artists.length,
      pk: artist.pk,
      artistName,
    });

    const pageId = await getPageId(artistName);
    if (!pageId) {
      logger.info(`no wiki found for`, { artistName });

      await updateArtist(artist.pk);
      return;
    }

    const wikiData = await getWikiData(pageId);
    if (!wikiData) {
      logger.info(`no wikiData`, {
        artistName,
        pageId,
      });
    }

    const website = await getWebsite(pageId);
    if (!website) {
      logger.info(`no website`, {
        artistName,
        pageId,
      });
    }

    const socialMedia = await getArtistMetadata(website);
    if (
      !socialMedia ||
      !Object.keys(socialMedia).find((key) => !!socialMedia[key])
    ) {
      logger.info(`no social media`, {
        artistName,
        pageId,
      });
    }

    const payload = {
      artist: artist.pk,
      wiki_page_id: pageId,
      ...wikiData,
      website: urlValidRegex.test(website) ? website : undefined,
      ...socialMedia,
    };

    await saveArtistMetadata(payload);
  });
}

async function processLocations(query) {
  const locations = await getLocations(query);
  logger.info(`locations found`, {
    total: locations.length,
  });
  let index = 0;

  await async.eachSeries(locations, async (location) => {
    index += 1;

    const locationName = snakeCase(location.name);

    logger.info(`processing location`, {
      index,
      total: locations.length,
      pk: location.pk,
      locationName,
    });

    const pageId = await getPageId(locationName);
    if (!pageId) {
      logger.info(`no wiki found for`, { locationName });

      await updateLocationRetries(location.pk, { wiki_tries: 1 });
      return;
    }

    const wikiData = await getWikiData(pageId);
    if (!wikiData) {
      logger.info(`no wikiData`, {
        locationName,
        pageId,
      });
    }

    const website = await getWebsite(pageId);
    if (!website) {
      logger.info(`no website`, {
        locationName,
        pageId,
      });
    }

    const socialMedia = await getArtistMetadata(website);
    if (
      !socialMedia ||
      !Object.keys(socialMedia).find((key) => !!socialMedia[key])
    ) {
      logger.info(`no social media`, {
        locationName,
        pageId,
      });
    }

    const payload = {
      location: location.pk,
      wiki_page_id: pageId,
      ...wikiData,
      website: urlValidRegex.test(website) ? website : undefined,
      ...socialMedia,
    };

    await saveLocationMetadata(payload);
  });
}

async function main() {
  const query = `metadata_empty=true&wiki_tries=3&ordering=wiki_tries&limit=100`;
  await processArtists(query);

  await processLocations(query);
}

main().then(() => {
  logger.info("finished metadata");
  logger.flush();
});
