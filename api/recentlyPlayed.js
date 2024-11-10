/*

import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    console.error("Error: No hay token de acceso en la solicitud");
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 10,
      },
    });

    const songs = response.data.items.map(item => ({
      songName: item.track.name,
      artistName: item.track.artists[0].name,
      artistLink: item.track.artists[0].external_urls.spotify,
      albumImage: item.track.album.images[0].url,
    }));

    res.status(200).json(songs);
  } catch (error) {
    console.error('Error al obtener canciones recientes:', error.message);
    res.status(500).json({ error: 'Error al obtener canciones recientes', details: error.message });
  }
}
*/
// /api/recentlyPlayed.js

import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await response.json();
    const artists = data.items.map((item) => ({
      id: item.track.artists[0].id,
      name: item.track.artists[0].name,
    }));

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los últimos artistas escuchados' });
  }
}
