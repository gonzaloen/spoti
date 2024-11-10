import React, { useEffect, useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import { getRecentlyPlayedArtists, getFollowedArtists, getGenres, getTopArtistsByGenre } from '../lib/api';

export default function Home() {
  // Estados locales para almacenar datos de artistas y géneros
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topArtistsByGenre, setTopArtistsByGenre] = useState({});
  const [localFollowedArtists, setLocalFollowedArtists] = useState(
    JSON.parse(localStorage.getItem('localFollowedArtists')) || []
  );

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    async function fetchData() {
      // Cargar últimos artistas escuchados en Spotify
      const recentArtists = await getRecentlyPlayedArtists();
      setRecentlyPlayedArtists(recentArtists);

      // Cargar artistas seguidos en Spotify
      const followed = await getFollowedArtists();
      setFollowedArtists(followed);

      // Cargar géneros principales
      const genreData = await getGenres();
      setGenres(genreData);

      // Cargar artistas principales por género
      const topArtists = await getTopArtistsByGenre(genreData);
      setTopArtistsByGenre(topArtists);
    }

    fetchData();
  }, []);

  // Función para gestionar el botón "Seguir" en la web local
  const handleFollow = (artist) => {
    if (!artist.id) return;

    const updatedArtists = [...localFollowedArtists, artist];
    setLocalFollowedArtists(updatedArtists);
    localStorage.setItem('localFollowedArtists', JSON.stringify(updatedArtists));

    // Log de confirmación
    console.log("Artista seguido en la web local:", artist.name);
  };

  return (
    <div>
      {/* Sección: Artistas Seguidos en Nuestra App */}
      <h1>Artistas Seguidos en Nuestra App</h1>
      <div>
        {localFollowedArtists.length > 0 ? (
          localFollowedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist}>
              <p>Oyentes mensuales en Spotify: {artist.monthlyListeners}</p>
            </ArtistCard>
          ))
        ) : (
          <p>No has seguido a ningún artista en nuestra app aún.</p>
        )}
      </div>

      {/* Sección: Artistas Seguidos en Spotify */}
      <h1>Artistas Seguidos en Spotify</h1>
      <div>
        {followedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist}>
            <button
              onClick={() => handleFollow(artist)}
              disabled={localFollowedArtists.some((a) => a.id === artist.id)}
            >
              {localFollowedArtists.some((a) => a.id === artist.id) ? 'Siguiendo' : 'Seguir'}
            </button>
          </ArtistCard>
        ))}
      </div>

      {/* Sección: Últimos Artistas Escuchados en Spotify */}
      <h1>Últimos Artistas Escuchados en Spotify</h1>
      <div>
        {recentlyPlayedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      {/* Sección: Géneros Principales */}
      <h1>Géneros Principales</h1>
      <div>
        {genres.map((genre) => (
          <div key={genre.id}>
            <h2>{genre.name}</h2>
            <div>
              {topArtistsByGenre[genre.name]?.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
