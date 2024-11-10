import { useEffect, useState } from 'react';
import { getFollowedArtists, getTopGenres, getTopArtistsByGenre, getRecentlyPlayed } from './api'; // Importar las funciones para Spotify
import ArtistCard from './components/ArtistCard';

export default function Home() {
  const [followedArtists, setFollowedArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [topArtistsByGenre, setTopArtistsByGenre] = useState([]);
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState([]);
  const [localFollowedArtists, setLocalFollowedArtists] = useState([]);

  useEffect(() => {
    // Obtener datos de Spotify al cargar
    getFollowedArtists().then(setFollowedArtists);
    getTopGenres().then(setTopGenres);
    getTopArtistsByGenre().then(setTopArtistsByGenre);

    // Obtener los últimos artistas escuchados, limitando a 8 artistas únicos
    getRecentlyPlayed().then((recentlyPlayed) => {
      const uniqueArtists = Array.from(new Set(recentlyPlayed.map(track => track.artist)))
        .slice(0, 8); // Limitar a 8 artistas
      setRecentlyPlayedArtists(uniqueArtists);
    });

    // Obtener artistas seguidos localmente desde localStorage
    const storedArtists = JSON.parse(localStorage.getItem('localFollowedArtists')) || [];
    setLocalFollowedArtists(storedArtists);
  }, []);

  // Función para manejar el seguimiento de un artista en la web local
  const handleFollow = (artist) => {
    const updatedArtists = [...localFollowedArtists, artist];
    setLocalFollowedArtists(updatedArtists);
    localStorage.setItem('localFollowedArtists', JSON.stringify(updatedArtists));
  };

  // Verificar si un artista ya está seguido en la web local
  const isFollowing = (artistId) => localFollowedArtists.some((artist) => artist.id === artistId);

  return (
    <div>
      {/* Sección: Artistas Seguidos en Nuestra App */}
      <h1>Artistas Seguidos en nuestra app</h1>
      <div>
        {localFollowedArtists.length > 0 ? (
          localFollowedArtists.map((artist) => (
            <div key={artist.id}>
              <h2>{artist.name}</h2>
              <p>Oyentes mensuales: {artist.monthlyListeners}</p>
            </div>
          ))
        ) : (
          <p>No has seguido a ningún artista en nuestra app aún.</p>
        )}
      </div>

      {/* Sección: Últimos Artistas Escuchados en Spotify */}
      <h1>Últimos Artistas Escuchados en Spotify</h1>
      <div>
        {recentlyPlayedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      {/* Sección: Artistas Seguidos en Spotify */}
      <h1>Artistas Seguidos en Spotify</h1>
      <div>
        {followedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist}>
            <button
              onClick={() => handleFollow(artist)}
              disabled={isFollowing(artist.id)}
            >
              {isFollowing(artist.id) ? 'Siguiendo' : 'Seguir'}
            </button>
          </ArtistCard>
        ))}
      </div>

      {/* Sección: Géneros Favoritos */}
      <h1>Géneros Favoritos</h1>
      <div>
        {topGenres.map((genre) => (
          <div key={genre}>
            <h2>{genre}</h2>
          </div>
        ))}
      </div>

      {/* Sección: Top Artistas por Género */}
      <h1>Top Artistas por Género</h1>
      <div>
        {topArtistsByGenre.map((genre) => (
          <div key={genre.name}>
            <h2>{genre.name}</h2>
            {genre.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
