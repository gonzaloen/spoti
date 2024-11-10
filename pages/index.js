// /pages/index.js

import React, { useEffect, useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import { getRecentlyPlayedArtists, getFollowedArtists, getTopArtistsByGenre, getGenres } from '../lib/api';

export default function Home() {
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topArtistsByGenre, setTopArtistsByGenre] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const recentlyPlayed = await getRecentlyPlayedArtists();
      const followed = await getFollowedArtists();
      const genreData = await getGenres();
      const topArtists = await getTopArtistsByGenre('pop'); // Ejemplo de género

      setRecentlyPlayedArtists(recentlyPlayed);
      setFollowedArtists(followed);
      setGenres(genreData);
      setTopArtistsByGenre(topArtists);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Artistas Seguidos en Nuestra App</h1>
      <div>
        {followedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      <h1>Últimos Artistas Escuchados en Spotify</h1>
      <div>
        {recentlyPlayedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      <h1>Géneros Principales</h1>
      <ul>
        {genres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>

      <h1>Artistas Principales por Género</h1>
      <div>
        {topArtistsByGenre.map((artist) => (
       
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
