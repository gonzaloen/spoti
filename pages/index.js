/***
import { useEffect, useState } from 'react';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch('/api/recentlyPlayed');
        if (response.ok) {
          const data = await response.json();
          setSongs(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al cargar canciones:', error);
      }
    }

    fetchSongs();
  }, []);

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {songs.map((song, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', backgroundColor: '#f3f3f3' }}>
            <a href={song.artistLink} target="_blank" rel="noopener noreferrer">
              <img src={song.albumImage} alt={song.songName} style={{ width: '100%', borderRadius: '8px' }} />
              <h3>{song.songName}</h3>
              <p>{song.artistName}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
*///
import { useEffect, useState } from 'react';

export default function Home() {
  const [artists, setArtists] = useState([]);
  const [offset, setOffset] = useState(0);
  const [topGenres, setTopGenres] = useState([]);

  // Obtener artistas seguidos con su último lanzamiento
  useEffect(() => {
    async function fetchArtists() {
      const response = await fetch(`/api/getFollowedArtists?offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setArtists(prev => [...prev, ...data]);
      }
    }
    fetchArtists();
  }, [offset]);

  // Obtener los géneros más escuchados
  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch('/api/getTopGenres');
      if (response.ok) {
        const data = await response.json();
        setTopGenres(data);
      }
    }
    fetchGenres();
  }, []);

  return (
    <div>
      <h1>Tus Artistas Seguidos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {artists.map((artist) => (
          <div key={artist.id} style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', backgroundColor: '#f3f3f3' }}>
            <img src={artist.image} alt={artist.name} style={{ width: '100%', borderRadius: '8px' }} />
            <h3>{artist.name}</h3>
            <p>{artist.followers} seguidores</p>
            {artist.lastRelease && (
              <div>
                <p>Último lanzamiento: {artist.lastRelease.name} ({artist.lastRelease.releaseDate})</p>
                <img src={artist.lastRelease.albumCover} alt={artist.lastRelease.name} style={{ width: '100px', borderRadius: '4px' }} />
              </div>
            )}
            <button>Seguir</button>
            <button>Dejar de Seguir</button>
          </div>
        ))}
      </div>
      <button onClick={() => setOffset(prev => prev + 10)}>Cargar más artistas</button>

      <h2>Tus 5 Géneros Más Escuchados</h2>
      <ul>
        {topGenres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>

      <h2>Descubrimiento Semanal</h2>
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZEVXcJZyENOWUFo7"
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
}
