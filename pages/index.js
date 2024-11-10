import React, { useEffect, useState } from 'react';
import ArtistCard from '../components/ArtistCard'; // Componente que muestra cada artista
import { getFollowedArtists, getRecentlyPlayedArtists, getGenres, getTopArtistsByGenre } from '../lib/api';

const Home = () => {
  const [followedArtists, setFollowedArtists] = useState([]);
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [topArtistsByGenre, setTopArtistsByGenre] = useState({});

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const followed = await getFollowedArtists();
      setFollowedArtists(followed);

      const recentlyPlayed = await getRecentlyPlayedArtists();
      setRecentlyPlayedArtists(recentlyPlayed);

      const genres = await getGenres();
      setTopGenres(genres);

      const artistsByGenre = {};
      for (const genre of genres) {
        artistsByGenre[genre] = await getTopArtistsByGenre(genre);
      }
      setTopArtistsByGenre(artistsByGenre);
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Sección: Artistas Seguidos en nuestra app */}
      <section>
        <h1>Artistas Seguidos en nuestra app</h1>
        <div>
          {followedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Sección: Últimos Artistas Escuchados en Spotify */}
      <section>
        <h1>Últimos Artistas Escuchados en Spotify</h1>
        <div>
          {recentlyPlayedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Sección: Top Géneros y Artistas por Género */}
      <section>
        <h1>Géneros más Escuchados y sus Artistas</h1>
        {topGenres.map((genre) => (
          <div key={genre}>
            <h2>{genre}</h2>
            <div>
              {topArtistsByGenre[genre]?.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
