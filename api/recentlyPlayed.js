import axios from 'axios';

export default async function handler(req, res) {
  const { access_token } = req.query;

  const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const songs = response.data.items.map(item => ({
    songName: item.track.name,
    artistName: item.track.artists[0].name,
    artistLink: item.track.artists[0].external_urls.spotify,
  }));

  res.status(200).json(songs);
}
