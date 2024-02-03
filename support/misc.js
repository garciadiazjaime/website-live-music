const cheerio = require("cheerio");

const logger = require("./logger.js")("misc");

const sleep = async (ms = 1_000) => {
  logger.info(`sleeping`, {
    seconds: ms / 1000,
  });

  await new Promise((resolve) => setTimeout(resolve, ms));
};

const snakeCase = (value) => value.trim().replace(/ /g, "_");

const urlValidRegex =
  /https?:\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,})(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?/i;
const twitterRegex = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/gi;
const facebookRegex =
  /http(?:s)?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/gi;
const youtubeRegex = /http(?:s)?:\/\/(?:www\.)?youtube\.com\/([a-zA-Z0-9_]+)/gi;
const instagramRegex =
  /http(?:s)?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_\.]+)/gi;
const tiktokRegex = /http(?:s)?:\/\/(?:www\.)?tiktok\.com\/([a-zA-Z0-9_]+)/gi;
const soundcloudRegex =
  /http(?:s)?:\/\/(?:www\.)?soundcloud\.com\/([a-zA-Z0-9_]+)/gi;
const spotifyRegex =
  /https?:\/\/open\.spotify\.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|)/gi;
const appleMusicRegex =
  /https?:\/\/music\.apple\.com\/([a-zA-Z]{2})\/(album|artist|playlist|station)\/([a-zA-Z0-9_-]+)\/(\d+)/gi;

const validURL = (value) => urlValidRegex.test(value);

const getImage = (html, website) => {
  const $ = cheerio.load(html);
  let image =
    $('[property="og:image"]').attr("content") ||
    $('[property="twitter:image"]').attr("content");

  if (image?.[0] === "/") {
    image = `${website}${image}`;
  }

  return validURL(image) ? image : undefined;
};

const getTwitter = (value) => {
  const twitter = value
    .match(twitterRegex)
    ?.filter((item) => !item.includes("twitter.com/intent"))[0];

  if (["http://www.twitter.com/wix"].includes(twitter)) {
    return;
  }

  return twitter;
};

const getFacebook = (value) => {
  const facebook = value
    .match(facebookRegex)
    ?.filter((item) => !item.includes("facebook.com/sharer"))[0];

  if (
    [
      "https://www.facebook.com/pages",
      "https://www.facebook.com/profile",
      "https://www.facebook.com/tr",
    ].includes(facebook)
  ) {
    return;
  }

  return facebook;
};
const getYoutube = (value) => {
  const youtube = value.match(youtubeRegex)?.pop();

  if (
    [
      "https://www.youtube.com/c",
      "https://www.youtube.com/watch",
      "https://www.youtube.com/channel",
      "https://www.youtube.com/embed",
      "https://www.youtube.com/user",
    ].includes(youtube)
  ) {
    return;
  }

  return youtube;
};
const getInstagram = (value) => {
  const instagram = value
    .match(instagramRegex)
    ?.filter((item) => item !== "https://www.instagram.com/explore")[0];

  return instagram;
};
const getTiktok = (value) => value.match(tiktokRegex)?.pop();
const getSoundcloud = (value) => value.match(soundcloudRegex)?.pop();
const getSpotify = (value) =>
  value.match(spotifyRegex)?.filter((item) => item.includes("artist"))[0];
const getAppleMusic = (value) => value.match(appleMusicRegex)?.pop();

const getSocial = (html, website) => {
  const image = getImage(html, website);
  const twitter = getTwitter(html);
  const facebook = getFacebook(html);
  const youtube = getYoutube(html);
  const instagram = getInstagram(html);
  const tiktok = getTiktok(html);
  const soundcloud = getSoundcloud(html);
  const spotify = getSpotify(html);
  const appleMusic = getAppleMusic(html);

  return {
    website,
    image,
    twitter,
    facebook,
    youtube,
    instagram,
    tiktok,
    soundcloud,
    spotify,
    appleMusic,
  };
};

async function getImageFromURL(url, social) {
  logger.info(`getting ${social} image`, { url });
  const response = await fetch(url).catch(() => false);

  if (!response) {
    logger.info(`${social} error`, { url });

    return;
  }

  const html = await response.text();

  const image = getImage(html, url);

  return image;
}

async function getDataFromWebsite(url) {
  if (!url) {
    logger.info(`no website`);

    return;
  }

  const response = await fetch(url).catch(() => false);

  if (!response) {
    logger.info(`website error`, { url });

    return;
  }

  const html = await response.text();

  const social = getSocial(html, url);

  return social;
}

const getGenres = (html) => {
  const $ = cheerio.load(html);
  const genres = $(".genre-list a")
    .toArray()
    .map((item) => {
      return { name: $(item).text() };
    });

  return genres;
};

module.exports = {
  sleep,
  snakeCase,
  urlValidRegex,
  validURL,
  getSocial,
  getImageFromURL,
  getDataFromWebsite,
  getGenres,
};
