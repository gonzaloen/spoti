// Ruta: pages/api/toggleFollow.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Esta API permite al usuario seguir o dejar de seguir a un artista en la aplicación.
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { artistId, action } = req.query;

  if (!artistId || !["follow", "unfollow"].includes(action)) {
    return res.status(400).json({ error: "Parámetros inválidos" });
  }

  try {
    if (action === "follow") {
      await spotifyApi.followArtists([artistId]);
    } else {
      await spotifyApi.unfollowArtists([artistId]);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al seguir/dejar de seguir al artista:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}
