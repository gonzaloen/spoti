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

export default async function handler(req, res) {
  try {
    const { access_token } = req.query;
    console.log('Token de acceso recibido en recentlyPlayed:', access_token);

    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const songs = response.data.items.map(item => ({
      songName: item.track.name,
      artistName: item.track.artists[0].name,
      artistLink: item.track.artists[0].external_urls.spotify,
      albumImage: item.track.album.images[0].url, // Imagen del álbum
    }));

    res.status(200).json(songs);
  } catch (error) {
    console.error('Error en /api/recentlyPlayed:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
