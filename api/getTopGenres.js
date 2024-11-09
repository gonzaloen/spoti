/**import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
      },
    });

    const genresCount = {};
    response.data.items.forEach(artist => {
      artist.genres.forEach(genre => {
        genresCount[genre] = (genresCount[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genresCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    res.status(200).json(topGenres);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener géneros más escuchados', details: error.message });
  }
}*//

import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
      },
    });

    // Obtener géneros de los artistas principales
    const genres = response.data.items.flatMap(artist => artist.genres);
    const topGenres = [...new Set(genres)].slice(0, 5); // Seleccionar los primeros 5 géneros únicos

    res.status(200).json(topGenres);
  } catch (error) {
    console.error('Error al obtener géneros:', error.message);
    res.status(500).json({ error: 'Error al obtener géneros', details: error.message });
  }
}

