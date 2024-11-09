import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { offset = 0 } = req.query;
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    // Obtener los artistas seguidos con paginación
    const response = await axios.get('https://api.spotify.com/v1/me/following', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        type: 'artist',
        limit: 10,
        offset: offset,
      },
    });

    const artists = response.data.artists.items;

    // Obtener el último lanzamiento de cada artista
    const artistsWithReleases = await Promise.all(
      artists.map(async (artist) => {
        const releaseResponse = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 1,
            include_groups: 'album,single',
          },
        });

        const lastRelease = releaseResponse.data.items[0] || null;

        return {
          id: artist.id,
          name: artist.name,
          image: artist.images[0]?.url,
          followers: artist.followers.total,
          lastRelease: lastRelease ? {
            name: lastRelease.name,
            releaseDate: lastRelease.release_date,
            albumCover: lastRelease.images[0]?.url,
          } : null,
        };
      })
    );

    res.status(200).json(artistsWithReleases);
  } catch (error) {
    console.error('Error al obtener artistas seguidos:', error);
    res.status(500).json({ error: 'Error al obtener artistas' });
  }
}
