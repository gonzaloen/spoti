/*

import querystring from 'querystring';

export default function handler(req, res) {
  const scope = 'user-read-recently-played';
  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  })}`;

  res.redirect(authURL);
}
*/
// /api/login.js

export default function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const scope = 'user-follow-read user-read-recently-played';

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

  res.redirect(authUrl);
}
