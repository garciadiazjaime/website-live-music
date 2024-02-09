const cheerio = require("cheerio");

const { validURL, getGenres } = require("./misc");
const logger = require("./logger")("musicbrainz");

async function getProfileFromMusicbrainz(name) {
  const domain = "https://musicbrainz.org";
  const url = `${domain}/search?query=${name}&type=artist&method=indexed`;
  logger.info(`searching brainz`, { name });

  const response = await fetch(url);

  const html = await response.text();

  let $ = cheerio.load(html);

  const anchor = $("#content table tbody tr a").first();

  if (!anchor.length) {
    logger.info(`no artist results`, { name });
    return;
  }

  return `${domain}${anchor.attr("href")}`;
}

async function getSocialFromProfile(profile) {
  logger.info(`scrapping brainz profile`, { url: profile });

  const response = await fetch(profile);

  const html = await response.text();

  const genres = getGenres(html);

  $ = cheerio.load(html);

  const links = [
    ["website", "home-favicon"],
    ["instagram", "instagram-favicon"],
    ["twitter", "twitter-favicon"],
    ["facebook", "facebook-favicon"],
    ["soundcloud", "soundcloud-favicon"],
    ["spotify", "spotify-favicon"],
    ["youtube", "youtube-favicon"],
    ["bandcamp", "bandcamp-favicon"],
  ];
  return links.reduce(
    (accumulator, [social, selector]) => {
      let href = $(`.external_links .${selector} a`).attr("href");
      if (!href) {
        return accumulator;
      }

      if (href.slice(0, 2) === "//") {
        href = `https:${href}`;
      }

      accumulator.metadata[social] = href;

      return accumulator;
    },
    { genres, metadata: {} }
  );
}

async function getMusicbrainz(name) {
  const artistName = name.trim().replace(/ /g, "+").replace("and+", "");
  const profile = await getProfileFromMusicbrainz(artistName);

  if (!validURL(profile)) {
    logger.info(`invalid profile`, { name, profile: profile });
    return;
  }

  const social = await getSocialFromProfile(profile);

  return {
    profile,
    ...social,
  };
}

module.exports = {
  getMusicbrainz,
};
