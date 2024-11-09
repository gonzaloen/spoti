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
import querystring from 'querystring';

export default function handler(req, res) {
  const scope = 'user-follow-read user-top-read';
  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  })}`;

  res.redirect(authURL);
}
