const async = require("async");
const cheerio = require("cheerio");
const slugify = require("slugify");

const {
  validURL,
  getDataFromWebsite,
  getImageFromURL,
  getGenres,
} = require("./misc");
const { getArtists } = require("./mint");

const logger = require("./logger.js")("artist");

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

      accumulator[social] = href;

      return accumulator;
    },
    { genres }
  );
}

async function getMusicbrainz(name) {
  const profile = await getProfileFromMusicbrainz(name);

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
    if (!musicbrainz) {
      logger.info(`no profile`, {
        artistName,
      });
      return;
    }

    const website = await getDataFromWebsite(musicbrainz.website);

    const payload = {
      name,
      profile: musicbrainz.profile,
      website: website ? musicbrainz.website : undefined,
      genres: musicbrainz.genres,
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
