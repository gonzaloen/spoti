import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

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
    const genres = Array.from(new Set(data.items.flatMap((artist) => artist.genres))).slice(0, 5);

    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los géneros más escuchados' });
  }
}
