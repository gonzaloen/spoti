/*
import axios from 'axios';
import querystring from 'querystring';
import cookie from 'cookie';

export default async function handler(req, res) {
  try {
    const { code } = req.query;

    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    res.setHeader('Set-Cookie', cookie.serialize('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    }));

    res.redirect('/');
  } catch (error) {
    console.error('Error en /api/callback:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
*/

import axios from 'axios';
import querystring from 'querystring';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    res.setHeader('Set-Cookie', cookie.serialize('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    }));

    res.redirect('/');
  } catch (error) {
    console.error('Error en /api/callback:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
