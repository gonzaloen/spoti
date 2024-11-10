import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await response.json();
    const artists = data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      listeners: artist.followers.total,
    }));

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas seguidos' });
  }
}
