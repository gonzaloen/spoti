import { useEffect, useState } from 'react';
import cookie from 'js-cookie';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [uniqueArtists, setUniqueArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [genreArtists, setGenreArtists] = useState({});

  useEffect(() => {
    async function fetchSongs() {
      const response = await fetch('/api/recentlyPlayed');
      if (response.ok) {
        const data = await response.json();
        setSongs(data);
        setIsAuthenticated(true);
      }
    }

    async function fetchFollowedArtists() {
      const response = await fetch('/api/getFollowedArtists');
      if (response.ok) {
        const data = await response.json();
        setFollowedArtists(data);
      }
    }

    async function fetchTopGenres() {
      const response = await fetch('/api/getTopGenres');
      if (response.ok) {
        const genres = await response.json();
        setTopGenres(genres);

        const genreArtistsData = {};
        for (const genre of genres) {
          const genreResponse = await fetch(`/api/getTopArtistsByGenre?genre=${genre}`);
          if (genreResponse.ok) {
            const artists = await genreResponse.json();
            genreArtistsData[genre] = artists;
          }
        }
        setGenreArtists(genreArtistsData);
      }
    }

    fetchSongs();
    fetchFollowedArtists();
    fetchTopGenres();
  }, []);

  const handleLogout = () => {
    cookie.remove('access_token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Bienvenido a Spotify Demo</h1>
        <p>Inicia sesión para ver tus datos de Spotify</p>
        <a href="/api/login">Iniciar Sesión</a>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={handleLogout}>Desloguearse</button>
      
      <h2>Top Géneros Escuchados y Artistas Relacionados</h2>
      {topGenres.map((genre, index) => (
        <div key={index}>
          <h3>{genre}</h3>
          <div className="carousel">
            {genreArtists[genre]?.map(artist => (
              <div key={artist.id} className="carousel-item">
                <a href={artist.link} target="_blank" rel="noopener noreferrer">
                  <img src={artist.image} alt={artist.name} className="carousel-image" />
                  <p>{artist.name}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
