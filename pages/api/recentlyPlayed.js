// Ruta: pages/api/recentlyPlayed.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Esta API obtiene las últimas canciones reproducidas por el usuario en Spotify.
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 8 });
    const tracks = data.body.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      imageUrl: item.track.album.images[0].url,
    }));

    res.status(200).json(tracks);
  } catch (error) {
    console.error("Error al obtener canciones recientemente escuchadas:", error);
    res.status(500).json({ error: "Error al obtener canciones recientemente escuchadas" });
  }
}
