// Ruta: pages/api/getTopGenres.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Esta API obtiene los principales géneros del usuario en Spotify.
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    const data = await spotifyApi.getMyTopArtists({ limit: 50 });
    const genres = data.body.items.flatMap((artist) => artist.genres);
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    res.status(200).json(topGenres);
  } catch (error) {
    console.error("Error al obtener géneros principales:", error);
    res.status(500).json({ error: "Error al obtener géneros principales" });
  }
}
