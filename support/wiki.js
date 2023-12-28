const { snakeCase, validURL } = require("./misc");

async function getPageId(name) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=%27${name}%27`;
  logger.info(`getting wiki-pageId`, { url });
  const response = await fetch(url);

  const data = await response.json();

  if (!data.query) {
    return;
  }

  const [pageId] = Object.keys(data.query.pages);

  return pageId;
}

async function getWiki(pageId) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=description&pageids=${pageId}&origin=*&format=json`;
  logger.info(`getting wiki-description`, { url });

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
  logger.info(`getting wiki-website`, { url });

  const response = await fetch(url);

  const html = await response.text();

  const $ = cheerio.load(html);

  const website = $(".official-website a").attr("href");

  if (website) {
    return website;
  }

  return $(".infobox.vcard.plainlist .external.text").attr("href");
}

async function getWikiData(event) {
  const name = snakeCase(event.name);

  const pageId = await getPageId(name);
  if (!pageId) {
    logger.info(`wiki not found for`, { pk: event.pk, name });

    // await updateLocation(event.pk, { meta_tries: 1 });
    return;
  }

  const wikiData = await getWiki(pageId);
  if (!wikiData) {
    logger.info(`no wikidata`, {
      pk: event.pk,
      name,
      pageId,
    });
  }

  const website = await getWebsite(pageId);
  if (!website) {
    logger.info(`no website`, {
      pk: event.pk,
      name,
      pageId,
    });
  }

  return {
    wiki_page_id: pageId,
    wiki_title: wikiData.wiki_title,
    wiki_description: wikiData.wiki_description,
    website: validURL(website) ? website : undefined,
  };
}
