const async = require("async");

require("dotenv").config();

const logger = require("./logger.js")("metadata");

const { getLocations, saveMetadata } = require("./mint");
const { getSocial, getImageFromURL } = require("./misc");

async function getMetadata(url) {
  logger.info(`scrapping`, { url });

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

  if (!social.image && social.soundcloud) {
    social.image = await getImageFromURL(social.soundcloud, "soundcloud");
  }

  if (!social || !Object.keys(social).find((key) => !!social[key])) {
    logger.info(`no social media`, {
      url,
    });
  }

  if (!social.image) {
    logger.info(`no image`, { url });
  }

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

    const socialMedia = await getMetadata(location.website);

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

    await saveMetadata(payload);
  });
}

if (require.main === module) {
  main().then(() => {
    logger.info("finished metadata");
    logger.flush();
  });
}

module.exports = {
  getMetadata,
};
