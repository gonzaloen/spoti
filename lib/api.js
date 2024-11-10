// Ruta: lib/api.js

// Obtener los últimos artistas escuchados
export async function getRecentlyPlayedArtists() {
  const res = await fetch("/api/recentlyPlayed");
  if (!res.ok) throw new Error("Error al obtener los últimos artistas escuchados");
  return res.json();
}

// Obtener artistas seguidos
export async function getFollowedArtists() {
  const res = await fetch("/api/getFollowedArtists");
  if (!res.ok) throw new Error("Error al obtener artistas seguidos");
  return res.json();
}

// Obtener géneros principales del usuario
export async function getTopGenres() {
  const res = await fetch("/api/getTopGenres");
  if (!res.ok) throw new Error("Error al obtener los géneros principales");
  return res.json();
}

// Obtener los artistas más escuchados por género
export async function getTopArtistsByGenre(genre) {
  const res = await fetch(`/api/getTopArtistsByGenre?genre=${encodeURIComponent(genre)}`);
  if (!res.ok) throw new Error("Error al obtener los artistas por género");
  return res.json();
}
