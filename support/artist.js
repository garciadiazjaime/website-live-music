const async = require("async");
const cheerio = require("cheerio");
const slugify = require("slugify");

const { validURL, getSocial, getImageFromURL } = require("./misc");
const { getEvents, saveMetadata, getArtists, updateEvent } = require("./mint");

const logger = require("./logger.js")("artist");

require("dotenv").config();

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
  logger.info(`searching brainz artist`, { name });

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

  logger.info(`getting brainz website`, { url: data.profile });

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

  return data;
}

async function main() {
  const chalk = (await import("chalk").then((mod) => mod)).default;

  logger.info("starting");
  const query = `location_empty=false&artist_tries=3&artist_empty=true&provider=SONGKICK&ordering=artist_tries&limit=100`;
  const events = await getEvents(query);

  if (!Array.isArray(events) || !events.length) {
    logger.info("no events to process");
    return;
  }

  logger.info(`events found`, { total: events.length });

  await async.eachSeries(events, async (event) => {
    logger.info(`processing event`, {
      pk: event.pk,
      name: event.name,
    });

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

        const payload = {
          artist_tries: 1,
          artist_pk: artistFound.pk,
        };
        console.log(payload);

        await updateEvent(event.pk, payload);
        return;
      }

      const musicbrainz = await getMusicbrainz(artistName);
      const website = await getDataFromWebsite(musicbrainz.website);

      const payload = {
        slug,
        event: event.pk,
        name,
        profile: musicbrainz.profile,
        website: website.error ? undefined : musicbrainz.website,
        instagram: musicbrainz.instagram || website.instagram,
        twitter: musicbrainz.twitter || website.twitter,
        facebook: musicbrainz.facebook || website.facebook,
        soundcloud: musicbrainz.soundcloud || website.soundcloud,
        spotify_url: musicbrainz.spotify || website.spotify,
        youtube: musicbrainz.youtube || website.youtube,
        image: musicbrainz.image || website.image,
        type: "ARTIST",
      };

      if (!payload.image && payload.soundcloud) {
        payload.image = await getImageFromURL(payload.soundcloud, "soundcloud");
      }

      if (!payload.image) {
        logger.info(`no image`, { slug });
      }

      await saveMetadata(payload);
    });
  });
}

main().then(() => {
  logger.info("finished");
  logger.flush();
});
