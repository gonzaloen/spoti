import querystring from 'querystring';

export default function handler(req, res) {
  const scope = 'user-read-recently-played';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  })}`;

  res.redirect(authURL);
}
