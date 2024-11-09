import { useEffect, useState } from 'react';

export default function Home() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fetchSongs() {
      const response = await fetch('/api/recentlyPlayed');
      const data = await response.json();
      setSongs(data);
    }
    fetchSongs();
  }, []);

  return (
    <div>
      <h1>Mis 10 Últimas Canciones Escuchadas</h1>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <a href={song.artistLink} target="_blank" rel="noopener noreferrer">
              {song.songName} - {song.artistName}
            </a>
          </li>
        ))}
      </ul>
      <a href="/api/login">Conectar con Spotify</a>
    </div>
  );
}
