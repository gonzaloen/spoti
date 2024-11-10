import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { genre } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await response.json();
    const artistsByGenre = data.items
      .filter((artist) => artist.genres.includes(genre))
      .map((artist) => ({
        id: artist.id,
        name: artist.name,
        listeners: artist.followers.total,
      }))
      .slice(0, 5); // Mostrar solo 5 artistas por género

    res.status(200).json(artistsByGenre);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas del género especificado' });
  }
}
