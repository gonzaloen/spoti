// Ruta: pages/api/callback.js

import { getSession } from "next-auth/react";
import { spotifyApi } from "../../lib/spotify";

// Este callback maneja la autenticación de Spotify para la aplicación.
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: "Código de autorización faltante" });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.status(200).json({
      access_token,
      refresh_token,
      expires_in,
    });
  } catch (error) {
    console.error("Error en el callback de autenticación:", error);
    res.status(500).json({ error: "Error al procesar el callback de autenticación" });
  }
}
