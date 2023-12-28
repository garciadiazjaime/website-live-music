const async = require("async");
require("dotenv").config();

const { getArtists, updateSpotify } = require("./mint");
const logger = require("./logger.js")("spotify");

const getToken = async () => {
  const url = "https://accounts.spotify.com/api/token";

  const details = {
    grant_type: "client_credentials",
    client_id: process.env.SPOTIFY_CLIENT,
    client_secret: process.env.SPOTIFY_SECRET,
  };

  let formBody = [];
  for (let property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  });

  const data = await response.json();
  if (response.status > 200) {
    logger.info("token response", data);
    return;
  }

  return data.access_token;
};

const getArtistDetails = async (token, id) => {
  const url = `https://api.spotify.com/v1/artists/${id}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer  ${token}`,
    },
  });

  const data = await response.json();
  if (response.status > 200) {
    logger.info(`error artist detail:`, {
      token,
      id,
      data,
    });
    return;
  }

  return data;
};

async function main() {
  logger.info("spotify starting");

  const token = await getToken();

  if (!token) {
    logger.info(`invalid token`);
    return;
  }

  const query =
    "&spotify_empty=false&spotify_tries=3&spotify_genres_empty=true&ordering=metadata__spotify__tries&limit=100";
  const artists = await getArtists(query);
  logger.info(`artist found`, { total: artists.length });
  await async.eachSeries(artists, async (artist) => {
    logger.info(`processing artist`, {
      pk: artist.pk,
      name: artist.name,
      spotify: artist.metadata?.spotify_url_read,
    });

    const id = artist.metadata.spotify_url_read.split("/").pop();
    const details = await getArtistDetails(token, id);

    if (!details) {
      logger.info(`invalid artist`, { id });
      const payload = {
        tries: 1,
      };
      await updateSpotify(payload, artist.metadata.spotify.pk);
      return;
    }

    const payload = {
      followers: details.followers.total,
      image: details.images[0]?.url,
      popularity: details.popularity,
      genres: details.genres,
    };

    await updateSpotify(payload, artist.metadata.spotify.pk);
  });
}

main().then(() => {
  logger.info("spotify end");
  logger.flush;
});
