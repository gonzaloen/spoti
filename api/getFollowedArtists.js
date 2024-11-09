import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    console.error("Error: No hay token de acceso en la solicitud");
    return res.status(401).json({ error: 'No autenticado' });
  }

  console.log("Token de acceso en la solicitud:", accessToken);  // <-- Verificar el token aquí

  try {
    console.log("Obteniendo artistas seguidos con token:", accessToken);
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

    console.log("Respuesta de artistas:", response.data);
    const artists = response.data.artists.items;

    const artistsWithReleases = await Promise.all(
      artists.map(async (artist) => {
        try {
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
        } catch (error) {
          console.error(`Error al obtener el último lanzamiento de ${artist.name}:`, error.message);
          return {
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url,
            followers: artist.followers.total,
            lastRelease: null,
          };
        }
      })
    );

    res.status(200).json(artistsWithReleases);
  } catch (error) {
    console.error('Error al obtener artistas seguidos:', error.message);
    res.status(500).json({ error: 'Error al obtener artistas', details: error.message });
  }
}
