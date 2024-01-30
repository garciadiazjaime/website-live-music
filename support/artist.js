const async = require("async");
const cheerio = require("cheerio");
const slugify = require("slugify");

const { validURL, getSocial, getImageFromURL, getGenres } = require("./misc");
const { getArtists } = require("./mint");

const logger = require("./logger.js")("artist");

async function getDataFromWebsite(url) {
  if (!url) {
    logger.info(`no website`);

    return {};
  }

  const response = await fetch(url).catch(() => false);

  if (!response) {
    logger.info(`website error`, { url });

    return { error: true };
  }

  const html = await response.text();

  const social = getSocial(html, url);

  return social;
}

async function getMusicbrainz(name) {
  const domain = "https://musicbrainz.org";
  const url = `${domain}/search?query=${name}&type=artist&method=indexed`;
  logger.info(`searching brainz`, { name });

  const responseSearch = await fetch(url);

  const htmlSearch = await responseSearch.text();

  let $ = cheerio.load(htmlSearch);

  const anchor = $("#content table tbody tr a").first();

  if (!anchor.length) {
    logger.info(`no artist results`, { name });
    return {};
  }

  const data = {
    profile: `${domain}${anchor.attr("href")}`,
  };

  if (!validURL(data.profile)) {
    logger.info(`invalid profile`, { name, profile: data.profile });
    return {};
  }

  logger.info(`scrapping brainz profile`, { url: data.profile });

  const responseDetails = await fetch(data.profile);

  const htmlDetails = await responseDetails.text();

  $ = cheerio.load(htmlDetails);

  const links = [
    ["website", "home-favicon"],
    ["instagram", "instagram-favicon"],
    ["twitter", "twitter-favicon"],
    ["facebook", "facebook-favicon"],
    ["soundcloud", "soundcloud-favicon"],
    ["spotify", "spotify-favicon"],
    ["youtube", "youtube-favicon"],
  ];
  links.forEach(([social, selector]) => {
    let href = $(`.external_links .${selector} a`).attr("href");
    if (!href) {
      return;
    }

    if (href.slice(0, 2) === "//") {
      href = `https:${href}`;
    }

    data[social] = href;
  });

  const genres = getGenres(htmlDetails);
  data.genres = genres;

  return data;
}

async function getArtist(event) {
  const chalk = (await import("chalk").then((mod) => mod)).default;

  const response = [];
  const artists = event.name.includes(",")
    ? event.name.split(",")
    : event.name.split(" and ");

  await async.eachSeries(artists, async (value) => {
    const artistName = value.trim().replace(/ /g, "+").replace("and+", "");
    const name = artistName.replace(/\+/g, " ");
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const query = `slug=${slug}`;
    const [artistFound] = await getArtists(query);

    logger.info(`internal search`, {
      slug,
      found: !!artistFound,
    });

    if (artistFound) {
      logger.info(chalk.green("found"), {
        slug,
      });
      response.push(artistFound);
      return;
    }

    const musicbrainz = await getMusicbrainz(artistName);
    if (!musicbrainz.profile) {
      logger.info(`no profile`, {
        artistName,
      });
      return;
    }

    const website = await getDataFromWebsite(musicbrainz.website);

    const payload = {
      name,
      profile: musicbrainz.profile,
      website: website.error ? undefined : musicbrainz.website,
      genres: musicbrainz.genres
    };

    if (!payload.website) {
      response.push(payload);
      return;
    }

    payload.metadata = {
      website: payload.website,
      image: musicbrainz.image || website.image,
      twitter: musicbrainz.twitter || website.twitter,
      facebook: musicbrainz.facebook || website.facebook,
      youtube: musicbrainz.youtube || website.youtube,
      instagram: musicbrainz.instagram || website.instagram,
      tiktok: musicbrainz.tiktok || website.tiktok,
      soundcloud: musicbrainz.soundcloud || website.soundcloud,
      spotify: musicbrainz.spotify || website.spotify,
      appleMusic: musicbrainz.appleMusic || website.appleMusic,
    };

    if (!payload.metadata.image && payload.metadata.soundcloud) {
      payload.metadata.image = await getImageFromURL(
        payload.metadata.soundcloud,
        "soundcloud"
      );
    }

    if (!payload.metadata.image) {
      logger.info(`no image`, { slug });
    }

    response.push(payload);
  });

  return response;
}

module.exports = {
  getArtist,
};
