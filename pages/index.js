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
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <a href={song.artistLink} target="_blank" rel="noopener noreferrer">
              {song.songName} - {song.artistName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
