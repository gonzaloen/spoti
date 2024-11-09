
import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/following', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        type: 'artist',
        limit: 10,
      },
    });

    const artists = response.data.artists.items.map(artist => ({
      name: artist.name,
      link: artist.external_urls.spotify,
      image: artist.images[0]?.url,
      followers: artist.followers.total,
    }));

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener artistas seguidos', details: error.message });
  }
}
