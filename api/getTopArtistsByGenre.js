import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;
  const { genre } = req.query;

  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    // Obtener los artistas principales del usuario
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50, // Para obtener suficientes artistas y filtrar por género
      },
    });

    // Filtrar artistas que contengan el género solicitado
    const filteredArtists = response.data.items
      .filter(artist => artist.genres.includes(genre))
      .map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url,
        link: artist.external_urls.spotify,
        isFollowing: false, // Estado inicial, se puede actualizar al seguir
      }));

    res.status(200).json(filteredArtists);
  } catch (error) {
    console.error('Error al obtener artistas por género:', error.message);
    res.status(500).json({ error: 'Error al obtener artistas por género', details: error.message });
  }
}
