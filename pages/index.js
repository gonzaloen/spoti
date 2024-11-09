import { useEffect, useState } from 'react';
import cookie from 'js-cookie';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [uniqueArtists, setUniqueArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            });
          }
        });
        setUniqueArtists(Array.from(artistsMap.values()));
      } else {
        setIsAuthenticated(false);
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
        const data = await response.json();
        setTopGenres(data);
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

  const toggleFollowArtist = async (artistId, shouldFollow) => {
    try {
      const endpoint = shouldFollow
        ? `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`
        : `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;

      await fetch(endpoint, {
        method: shouldFollow ? 'PUT' : 'DELETE',
        headers: {
          Authorization: `Bearer ${cookie.get('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      // Actualizar el estado después de seguir o dejar de seguir
      const updatedArtists = followedArtists.map(artist =>
        artist.id === artistId ? { ...artist, isFollowing: shouldFollow } : artist
      );
      setFollowedArtists(updatedArtists);
    } catch (error) {
      console.error('Error al cambiar el estado de seguimiento:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Bienvenido a Spotify Demo</h1>
        <p>Para ver tus últimas canciones, por favor inicia sesión con Spotify.</p>
        <a href="/api/login">Iniciar Sesión con Spotify</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Tus 10 Últimas Canciones Escuchadas</h1>
      <button onClick={handleLogout}>Desloguearse</button>

      <h2>Últimos Artistas Escuchados</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {uniqueArtists.map((artist, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <a href={artist.link} target="_blank" rel="noopener noreferrer">
              <img src={artist.albumImage} alt={artist.name} style={{ width: '100%' }} />
              <h3>{artist.name}</h3>
            </a>
          </div>
        ))}
      </div>

      <h2>Últimos Artistas Seguidos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {followedArtists.map((artist, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img src={artist.image} alt={artist.name} style={{ width: '100%' }} />
            <h3>{artist.name}</h3>
            <p>{artist.followers} seguidores</p>
            {artist.isFollowing ? (
              <button onClick={() => toggleFollowArtist(artist.id, false)}>Dejar de Seguir</button>
            ) : (
              <button onClick={() => toggleFollowArtist(artist.id, true)}>Seguir</button>
            )}
          </div>
        ))}
      </div>

      <h2>Tus 5 Estilos Más Escuchados</h2>
      <ul>
        {topGenres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>
    </div>
  );
}
