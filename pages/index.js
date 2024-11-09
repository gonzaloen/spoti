import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { artistId, action } = req.query;
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const method = action === 'follow' ? 'PUT' : 'DELETE';
    await axios({
      method,
      url: `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al seguir/dejar de seguir al artista:', error);
    res.status(error.response?.status || 500).json({
      error: 'Error al procesar la solicitud',
      details: error.message,
    });
  }
}
