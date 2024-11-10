// Ruta: lib/spotify.js

import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.NEXTAUTH_URL + "/api/callback",
});

// Función para establecer el token de acceso del usuario
export function setAccessToken(token) {
  spotifyApi.setAccessToken(token);
}

export { spotifyApi };
