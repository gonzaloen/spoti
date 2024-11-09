import { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import Router from 'next/router';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si existe el token en las cookies
    const accessToken = cookie.get('access_token');

    if (accessToken) {
      // Si hay un token, intenta obtener las canciones recientes
      async function fetchSongs() {
        try {
          const response = await fetch(`/api/recentlyPlayed?access_token=${accessToken}`);
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
    } else {
      // Si no hay token, redirige al usuario a /api/login para autenticarse
      Router.push('/api/login');
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Bienvenido a Spotify Demo</h1>
        <p>Redirigiendo a la página de autenticación...</p>
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
