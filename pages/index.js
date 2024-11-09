import { useEffect, useState } from 'react';
import cookie from 'cookie';
import axios from 'axios';

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const accessToken = cookies.access_token || null;

  if (!accessToken) {
    // Si no hay token, redirige a /api/login
    return {
      redirect: {
        destination: '/api/login',
        permanent: false,
      },
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
  if (!songs || songs.length === 0) {
    return (
      <div>
        <h1>Bienvenido a Spotify Demo</h1>
        <p>No se encontraron canciones recientes o el usuario no está autenticado.</p>
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
