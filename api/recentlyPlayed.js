/***import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { access_token } = req.query;

    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const songs = response.data.items.map(item => ({
      songName: item.track.name,
      artistName: item.track.artists[0].name,
      artistLink: item.track.artists[0].external_urls.spotify,
    }));

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
*///

import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const songs = response.data.items.map(item => ({
      songName: item.track.name,
      artistName: item.track.artists[0].name,
      artistLink: item.track.artists[0].external_urls.spotify,
      albumImage: item.track.album.images[0]?.url || '',
    }));

    res.status(200).json(songs);
  } catch (error) {
    console.error('Error en /api/recentlyPlayed:', error);
    res.status(500).json({ error: 'Error al obtener las canciones' });
  }
}
