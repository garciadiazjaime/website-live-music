const cheerio = require("cheerio");
const async = require("async");
require("dotenv").config();

const { getArtists, saveArtistMetadata } = require("./mint");

async function getPageId(artistName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=%27${artistName}%27`;
  console.log(`getting pageId: ${url}`);
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
  console.log(`getting description: ${url}`);

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
  console.log(`getting website: ${url}`);

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
  console.log(`getting artist metadata: ${website}`);
  const response = await fetch(website).catch((error) => console.log(error));
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

const snakeCase = (value) => value.trim().replace(/ /g, "_");

async function processArtist(artist, index = 0) {
  if (index > 1) {
    return;
  }

  const artistName = snakeCase(index === 0 ? artist.name : artist.location);
  console.log(`processing[${index}]: ${artistName}`);
  console.log(`event: ${artist.event}`);
  const pageId = await getPageId(artistName);
  if (!pageId) {
    console.log(`no wiki found for: ${artistName}`);

    await saveArtistMetadata({ name: artist.name });
    await processArtist(artist, index + 1);
    return;
  }

  const wikiData = await getWikiData(pageId);
  if (!wikiData) {
    console.log(`no wikiData for ${artistName}:${pageId}`);
  }

  const website = await getWebsite(pageId);
  if (!website) {
    console.log(`no website for ${artistName}:${pageId}`);
  }

  const payload = {
    name: artist.name,
    wiki_page_id: pageId,
    ...wikiData,
    website,
  };

  const socialMedia = await getArtistMetadata(website);
  if (
    !socialMedia ||
    !Object.keys(socialMedia).find((key) => !!socialMedia[key])
  ) {
    console.log(`no social-media for ${artistName}:${pageId}`);

    await saveArtistMetadata(payload);
    await processArtist(artist, index + 1);
    return;
  }

  await saveArtistMetadata({ ...payload, ...socialMedia });
}

async function main() {
  const query = `wiki_empty=true&wiki_tries=3&limit=100`;
  const artists = await getArtists(query);
  console.log(`artist: ${artists.length}`);
  let index = 1;
  await async.eachSeries(artists, async (artist) => {
    console.log(`\n${index} / ${artists.length}...`);
    await processArtist(artist);
    index += 1;
  });
}

main().then(() => {
  console.log("end");
});