// Ruta: pages/api/login.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Esta API maneja el inicio de sesión y la redirección a Spotify.
export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    return res.redirect("/"); // Redirecciona a la página principal si ya hay una sesión activa.
  }

  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-follow-read",
    "user-top-read",
    "user-read-recently-played",
  ];

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

  res.redirect(authorizeURL);
}
