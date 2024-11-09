/*import { useEffect, useState } from 'react';

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
}*/

import { useEffect, useState } from 'react';
import cookie from 'cookie';
import axios from 'axios';
import Router from 'next/router';

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const accessToken = cookies.access_token || null;

  if (!accessToken) {
    // Si no hay token, redirige a /api/login
    return {
      props: { songs: [] },
    };
  }

  try {
    // Solicita las canciones recientemente escuchadas
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const songs = response.data.items.map(item => ({
      songName: item.track.name,
      artistName: item.track.artists[0].name,
      artistLink: item.track.artists[0].external_urls.spotify,
    }));

    return {
      props: { songs },
    };
  } catch (error) {
    console.error('Error fetching songs:', error);
    return {
      props: { songs: [] },
    };
  }
}

export default function Home({ songs }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(songs && songs.length > 0);
  }, [songs]);

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Bienvenido a Spotify y YouTube Demo</h1>
        <p>Inicia sesión para ver tus últimas canciones o videos vistos.</p>
        <div>
          <button onClick={() => Router.push('/api/login')}>
            Log in to Spotify
          </button>
          <button onClick={() => Router.push('/api/youtube-login')}>
            Log in to YouTube
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Tus 10 Últimas Canciones Escuchadas en Spotify</h1>
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

