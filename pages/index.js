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

        const artistsMap = new Map();
        data.forEach(song => {
          if (!artistsMap.has(song.artistName)) {
            artistsMap.set(song.artistName, {
              name: song.artistName,
              link: song.artistLink,
              albumImage: song.albumImage,
              id: song.artistId,
              latestRelease: song.latestRelease, // Suponemos que la API devuelve el último lanzamiento
            });
          }
        });
        setUniqueArtists(Array.from(artistsMap.values()));
      }
    }

    // Cargar los artistas seguidos desde localStorage al inicio
    const followed = JSON.parse(localStorage.getItem('followedArtists') || '[]');
    setFollowedArtists(followed);

    fetchSongs();
  }, []);

  const handleFollowToggle = (artist) => {
    const isFollowing = followedArtists.some(a => a.id === artist.id);

    // Añadir o quitar de los artistas seguidos con su último lanzamiento
    const updatedFollowedArtists = isFollowing
      ? followedArtists.filter(a => a.id !== artist.id)
      : [...followedArtists, artist];

    setFollowedArtists(updatedFollowedArtists);
    localStorage.setItem('followedArtists', JSON.stringify(updatedFollowedArtists));
  };

  const handleLogout = () => {
    cookie.remove('access_token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Bienvenido a Spotify Demo</h1>
        <p>Para ver tus datos, por favor inicia sesión con Spotify.</p>
        <a href="/api/login">Iniciar Sesión</a>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={handleLogout}>Desloguearse</button>

      {/* Módulo: Últimos Artistas Escuchados */}
      <h2>Últimos Artistas Escuchados</h2>
      <div className="grid">
        {uniqueArtists.map((artist, index) => {
          const isFollowing = followedArtists.some(a => a.id === artist.id);
          return (
            <div key={index} className="card">
              <a href={artist.link} target="_blank" rel="noopener noreferrer">
                <img src={artist.albumImage} alt={artist.name} className="artist-thumbnail" />
                <h3>{artist.name}</h3>
              </a>
              <button
                onClick={() => handleFollowToggle(artist)}
                className={isFollowing ? "button-unfollow" : "button-follow"}
              >
                {isFollowing ? "Dejar de Seguir" : "Seguir"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Módulo: Últimos Artistas Seguidos */}
      <h2>Últimos Artistas Seguidos</h2>
      <div className="grid">
        {followedArtists.map((artist, index) => (
          <div key={index} className="card">
            <img src={artist.albumImage} alt={artist.name} className="artist-thumbnail" />
            <h3>{artist.name}</h3>
            <p>{artist.followers} seguidores</p>
            <button
              onClick={() => handleFollowToggle(artist)}
              className={artist.isFollowing ? "button-unfollow" : "button-follow"}
            >
              {artist.isFollowing ? "Dejar de Seguir" : "Seguir"}
            </button>
          </div>
        ))}
      </div>

      {/* Módulo: Top Géneros y Artistas Relacionados */}
      <h2>Top Géneros Escuchados y Artistas Relacionados</h2>
      {topGenres.map((genre, index) => (
        <div key={index}>
          <h3>{genre}</h3>
          <div className="carousel">
            {genreArtists[genre]?.map(artist => (
              <div key={artist.id} className="carousel-item">
                <a href={artist.link} target="_blank" rel="noopener noreferrer">
                  <img src={artist.albumImage} alt={artist.name} className="carousel-image" />
                  <p>{artist.name}</p>
                </a>
                <button
                  onClick={() => handleFollowToggle(artist)}
                  className={artist.isFollowing ? "button-unfollow" : "button-follow"}
                >
                  {artist.isFollowing ? "Dejar de Seguir" : "Seguir"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Nuevo Bloque: De Quién Recibiré Novedades */}
      <h2>DE QUIEN RECIBIRÉ NOVEDADES?</h2>
      <div className="followed-artists">
        {followedArtists.map((artist, index) => (
          <div key={index} className="followed-artist-card">
            <img src={artist.albumImage} alt={artist.name} className="artist-circle" />
            <p>{artist.name}</p>
            <p>{artist.latestRelease ? `Último lanzamiento: ${artist.latestRelease}` : ''}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 2rem;
        }
        .grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .card, .followed-artist-card {
          text-align: center;
          width: 120px;
        }
        .artist-thumbnail {
          width: 100px;
          height: 100px;
          border-radius: 8px;
        }
        .artist-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .button-follow, .button-unfollow {
          padding: 0.5rem;
          margin-top: 0.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
