// Archivo centralizado para hacer las solicitudes de API desde el front
// Este archivo contiene funciones para obtener los datos de Spotify mediante los endpoints de la API

export async function getFollowedArtists() {
  const response = await fetch('/api/getFollowedArtists');
  if (!response.ok) throw new Error('Error al obtener los artistas seguidos');
  return response.json();
}

export async function getRecentlyPlayedArtists() {
  const response = await fetch('/api/recentlyPlayed');
  if (!response.ok) throw new Error('Error al obtener los últimos artistas escuchados');
  return response.json();
}

export async function getGenres() {
  const response = await fetch('/api/getTopGenres');
  if (!response.ok) throw new Error('Error al obtener los géneros');
  return response.json();
}

export async function getTopArtistsByGenre(genre) {
  const response = await fetch(`/api/getTopArtistsByGenre?genre=${encodeURIComponent(genre)}`);
  if (!response.ok) throw new Error('Error al obtener los artistas por género');
  return response.json();
}
