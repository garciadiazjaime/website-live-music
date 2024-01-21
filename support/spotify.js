require("dotenv").config();

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

async function getSpotify(artist) {
  if (!artist.metadata?.spotify) {
    logger.info(`no spotify`, {
      name: artist.name,
    });
    return;
  }

  logger.info(`processing artist`, {
    name: artist.name,
    spotify: artist.metadata.spotify,
  });

  const token = await getToken();
  const id = artist.metadata.spotify.split("/").pop();
  const details = await getArtistDetails(token, id);

  if (!details) {
    logger.info(`invalid artist`, { id });
    return;
  }

  const payload = {
    id,
    followers: details.followers.total,
    image: details.images[0]?.url,
    popularity: details.popularity,
    genres: details.genres,
  };

  return payload;
}

module.exports = {
  getSpotify,
};
