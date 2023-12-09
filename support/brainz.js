const cheerio = require("cheerio");
const async = require("async");
require("dotenv").config();
const { NerManager } = require("node-nlp");

const logger = require("./logger.js")("brainz");

const {
  getArtists,
  saveArtistMetadata,
  updateArtist,
  getLocations,
  saveLocationMetadata,
  updateLocationRetries,
} = require("./mint");
const { snakeCase } = require("./misc");

const BRAINZ_URL = "https://musicbrainz.org";

async function getEntities(value) {
  const manager = new NlpManager({ threshold: 0.8 });
  const entities = await manager.findEntities(value, "en");
  console.log({ entities });
}

async function getArtistPath(artistName) {
  const url = `${BRAINZ_URL}/search?query=${artistName}&type=artist&method=indexed`;
  logger.info(`search results`, { url });
  const response = await fetch(url);

  const html = await response.text();

  const $ = cheerio.load(html);

  return $("#content table tbody tr a").attr("href");
}

async function getArtist(artistPath) {
  const url = `${BRAINZ_URL}${artistPath}`;
  logger.info(`artist page`, { url });
}

async function processArtists(query) {
  const artists = await getArtists(query);
  logger.info(`artists found`, { total: artists.length });
  let index = 0;

  await async.eachSeries(artists, async (artist) => {
    index += 1;

    // const artistName = artist.name.replace(/ /g, "+");
    await getEntities(artist.name);

    return;
    logger.info(`processing artist`, {
      index,
      total: artists.length,
      pk: artist.pk,
      artistName,
    });

    const artistPath = await getArtistPath(artistName);

    // if (!pageId) {
    //   logger.info(`no wiki found for`, { artistName });

    //   await updateArtist(artist.pk);
    //   return;
    // }

    const wikiData = await getArtist(artistPath);
    return;
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

async function main() {
  const query = `metadata_empty=true&wiki_tries=4&ordering=-wiki_tries&limit=1`;
  await processArtists(query);
}

main().then(() => {
  logger.info("finished metadata");
  logger.flush();
});
