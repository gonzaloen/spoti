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
  // Asegurarse de que `artist.id` existe antes de intentar hacer la solicitud
  if (!artist.id) return;

  const updatedArtists = [...localFollowedArtists, artist];
  setLocalFollowedArtists(updatedArtists);
  localStorage.setItem('localFollowedArtists', JSON.stringify(updatedArtists));

  // Llamada a la API para actualizar en el backend
  fetch(`/api/toggleFollow?artistId=${artist.id}&action=follow`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error("Error al seguir/dejar de seguir al artista:", data);
    } else {
      console.log("Artista seguido en la web local:", artist.name);
    }
  })
  .catch(error => {
    console.error("Error al seguir/dejar de seguir al artista:", error);
  });
};


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
        onClick={() => handleFollow(artist)} // Asegurarse de que se está pasando el objeto `artist`
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
