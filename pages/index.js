/***import { useEffect, useState } from 'react';

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
        console.error('Error fetching songs:', error);
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
*////

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
