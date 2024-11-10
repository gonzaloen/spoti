// Ruta: pages/api/getTopArtistsByGenre.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Esta API obtiene los principales artistas del usuario por género en Spotify.
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  
  try {
    const data = await spotifyApi.getMyTopArtists({ limit: 50 });
    const artistsByGenre = data.body.items.reduce((acc, artist) => {
      const genre = artist.genres[0];
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(artist);
      return acc;
    }, {});
    
    const topGenres = Object.entries(artistsByGenre)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .map(([genre, artists]) => ({ genre, artists }));

    res.status(200).json(topGenres);
  } catch (error) {
    console.error("Error al obtener artistas por género:", error);
    res.status(500).json({ error: "Error al obtener artistas por género" });
  }
}
