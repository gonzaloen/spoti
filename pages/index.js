/*
import { useEffect, useState } from 'react';
import cookie from 'js-cookie';

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

  const handleLogout = () => {
    cookie.remove('access_token'); // Eliminar la cookie del token de acceso
    setIsAuthenticated(false);
    window.location.href = '/api/login'; // Redirigir al usuario para iniciar sesión de nuevo
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
*/

import { useEffect, useState } from 'react';
import cookie from 'js-cookie';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [uniqueArtists, setUniqueArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Obtener canciones recientes y artistas únicos
  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch('/api/recentlyPlayed');
        if (response.ok) {
          const data = await response.json();
          setSongs(data);
          setIsAuthenticated(true);

          // Filtrar artistas únicos de las últimas 10 canciones
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
      } catch (error) {
        console.error('Error al cargar canciones:', error);
      }
    }

    fetchSongs();
  }, []);

  // Obtener los artistas seguidos
  useEffect(() => {
    async function fetchFollowedArtists() {
      try {
        const response = await fetch('/api/getFollowedArtists');
        if (response.ok) {
          const data = await response.json();
          setFollowedArtists(data);
        }
      } catch (error) {
        console.error('Error al cargar artistas seguidos:', error);
      }
    }

    fetchFollowedArtists();
  }, []);

  // Obtener los géneros más escuchados
  useEffect(() => {
    async function fetchTopGenres() {
      try {
        const response = await fetch('/api/getTopGenres');
        if (response.ok) {
          const data = await response.json();
          setTopGenres(data);
        }
      } catch (error) {
        console.error('Error al cargar géneros favoritos:', error);
      }
    }

    fetchTopGenres();
  }, []);

  const handleLogout = () => {
    cookie.remove('access_token');
    setIsAuthenticated(false);
    window.location.href = '/api/login';
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
          <div key={index} style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', backgroundColor: '#f3f3f3' }}>
            <a href={artist.link} target="_blank" rel="noopener noreferrer">
              <img src={artist.albumImage} alt={artist.name} style={{ width: '100%', borderRadius: '8px' }} />
              <h3>{artist.name}</h3>
            </a>
          </div>
        ))}
      </div>

      <h2>Últimos Artistas Seguidos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {followedArtists.map((artist, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', backgroundColor: '#f3f3f3' }}>
            <img src={artist.image} alt={artist.name} style={{ width: '100%', borderRadius: '8px' }} />
            <h3>{artist.name}</h3>
            <p>{artist.followers} seguidores</p>
          </div>
        ))}
      </div>

      <h2>Tus 5 Estilos Más Escuchados</h2>
      <ul>
        {topGenres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>

      <h2>Tus Últimas Canciones Escuchadas</h2>
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


  
