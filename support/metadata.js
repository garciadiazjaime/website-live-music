const async = require("async");

require("dotenv").config();

const logger = require("./logger.js")("metadata");

const { getLocations, saveMetadata } = require("./mint");
const { getSocial, getImageFromURL } = require("./misc");

async function getLocationMetadata(url) {
  logger.info(`getting metadata`, { url });

  if (!url) {
    return {};
  }

  const response = await fetch(url).catch(() => false);
  if (!response) {
    logger.info(`error`, { url });
    return {};
  }

  const html = await response.text();

  const social = getSocial(html, url);

  return social;
}

async function main() {
  let query = `website_empty=false&metadata_empty=true&meta_tries=3&ordering=meta_tries&limit=100`;
  const locations = await getLocations(query);
  logger.info(`locations found`, {
    total: locations.length,
  });

  await async.eachSeries(locations, async (location) => {
    logger.info(`processing location`, {
      pk: location.pk,
      slug: location.slug,
    });

    const socialMedia = await getLocationMetadata(location.website);
    if (
      !socialMedia ||
      !Object.keys(socialMedia).find((key) => !!socialMedia[key])
    ) {
      logger.info(`no social media`, {
        pk: location.pk,
        slug: location.slug,
      });
    }

    const payload = {
      website: location.website,
      location: location.pk,
      type: "LOCATION",
      image: socialMedia?.image,
      twitter: socialMedia?.twitter,
      facebook: socialMedia?.facebook,
      youtube: socialMedia?.youtube,
      instagram: socialMedia?.instagram,
      tiktok: socialMedia?.tiktok,
      soundcloud: socialMedia?.soundcloud,
      spotify: socialMedia?.spotify,
      appleMusic: socialMedia?.appleMusic,
      slug: location.slug,
    };

    if (!payload.image && payload.spotify) {
      payload.image = await getImageFromURL(payload.spotify, "spotify");
    }

    if (!payload.image && payload.soundcloud) {
      payload.image = await getImageFromURL(payload.soundcloud, "soundcloud");
    }

    if (!payload.image) {
      logger.info(`no image`, { slug: payload.slug });
    }

    await saveMetadata(payload);
  });
}

main().then(() => {
  logger.info("finished metadata");
  logger.flush();
});
