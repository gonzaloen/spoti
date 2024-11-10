// /lib/api.js

export async function getRecentlyPlayedArtists() {
  const res = await fetch('/api/recentlyPlayed');
  const data = await res.json();
  return data.recentlyPlayed || [];
}

export async function getFollowedArtists() {
  const res = await fetch('/api/getFollowedArtists');
  const data = await res.json();
  return data.artists || [];
}

export async function getTopArtistsByGenre(genre) {
  const res = await fetch(`/api/getTopArtistsByGenre?genre=${genre}`);
  const data = await res.json();
  return data.artistsByGenre || [];
}

export async function getGenres() {
  const res = await fetch('/api/getTopGenres');
  const data = await res.json();
  return data.genres || [];
}
