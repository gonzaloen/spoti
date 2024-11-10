import { getSession } from 'next-auth/react';

// Endpoint para seguir o dejar de seguir a un artista en la web
export default async function handler(req, res) {
  const session = await getSession({ req });
  const { artistId, action } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {
      method: action === 'follow' ? 'PUT' : 'DELETE',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al seguir/dejar de seguir al artista');

    res.status(200).json({ message: 'Operación exitosa' });
  } catch (error) {
    res.status(400).json({ error: 'Error al procesar la solicitud', details: error.message });
  }
}
