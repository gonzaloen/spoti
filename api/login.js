import querystring from 'querystring';
import cookie from 'cookie';

export default function handler(req, res) {
  try {
    // Verificar si el token de acceso ya existe en las cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;

    // Si el token de acceso existe, redirige al usuario a la página protegida
    if (accessToken) {
      return res.redirect('/api/recentlyPlayed');
    }

    // Si no hay token, redirige a la autenticación de Spotify
    const scope = 'user-read-recently-played';
    const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    })}`;

    res.redirect(authURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
