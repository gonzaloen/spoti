// Ruta: pages/api/getFollowedArtists.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Esta API obtiene los artistas seguidos por el usuario en Spotify.
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  
  try {
    const data = await spotifyApi.getFollowedArtists({ limit: 10 });
    const artists = data.body.artists.items;

    res.status(200).json(artists);
  } catch (error) {
    console.error("Error al obtener artistas seguidos:", error);
    res.status(500).json({ error: "Error al obtener artistas seguidos" });
  }
}
