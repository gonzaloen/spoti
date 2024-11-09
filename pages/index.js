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
              isFollowing: false,
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
        setFollowedArtists(data.map(artist => ({
          ...artist,
          isFollowing: true,
        })));
      }
    }

    async function fetchTopGenres() {
      const response = await fetch('/api/getTopGenres');
      if (response.ok) {
        const genres = await response.json();
        setTopGenres(genres);

        const genreArtistsData = {};
        for (const genre of genres) {
          const genreResponse = await fetch(`/api/getTopArtistsByGenre?genre=${genre}`);
          if (genreResponse.ok) {
            const artists = await genreResponse.json();
            genreArtistsData[genre] = artists.slice(0, 5);
          }
        }
        setGenreArtists(genreArtistsData);
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

  const toggleFollowArtist = async (artistId, shouldFollow, source, genre) => {
    try {
      const endpoint = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
      await fetch(endpoint, {
        method: shouldFollow ? 'PUT' : 'DELETE',
        headers: {
          Authorization: `Bearer ${cookie.get('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      // Actualizar solo el estado de seguimiento del artista específico
      if (source === 'uniqueArtists') {
        setUniqueArtists(uniqueArtists.map(artist =>
          artist.id === artistId ? { ...artist, isFollowing: shouldFollow } : artist
        ));
      } else if (source === 'followedArtists') {
        setFollowedArtists(followedArtists.map(artist =>
          artist.id === artistId ? { ...artist, isFollowing: shouldFollow } : artist
        ));
      } else if (source === 'genreArtists') {
        setGenreArtists(prevGenreArtists => {
          const updatedGenreArtists = { ...prevGenreArtists };
          updatedGenreArtists[genre] = updatedGenreArtists[genre].map(artist =>
            artist.id === artistId ? { ...artist, isFollowing: shouldFollow } : artist
          );
          return updatedGenreArtists;
        });
      }
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

      {/* Últimos Artistas Escuchados */}
      <h2>Últimos Artistas Escuchados</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {uniqueArtists.map((artist, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <a href={artist.link} target="_blank" rel="noopener noreferrer">
              <img src={artist.albumImage} alt={artist.name} style={{ width: '100%' }} />
              <h3>{artist.name}</h3>
            </a>
            {artist.isFollowing ? (
              <button onClick={() => toggleFollowArtist(artist.id, false, 'uniqueArtists')}>Dejar de Seguir</button>
            ) : (
              <button onClick={() => toggleFollowArtist(artist.id, true, 'uniqueArtists')}>Seguir</button>
            )}
          </div>
        ))}
      </div>

      {/* Últimos Artistas Seguidos */}
      <h2>Últimos Artistas Seguidos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {followedArtists.map((artist, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img src={artist.image} alt={artist.name} style={{ width: '100%' }} />
            <h3>{artist.name}</h3>
            <p>{artist.followers} seguidores</p>
            {artist.isFollowing ? (
              <button onClick={() => toggleFollowArtist(artist.id, false, 'followedArtists')}>Dejar de Seguir</button>
            ) : (
              <button onClick={() => toggleFollowArtist(artist.id, true, 'followedArtists')}>Seguir</button>
            )}
          </div>
        ))}
      </div>

      {/* Top Géneros con Artistas Relacionados */}
      <h2>Tus 5 Estilos Más Escuchados</h2>
      {topGenres.map((genre, index) => (
        <div key={index}>
          <h3>{genre}</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(genreArtists[genre] || []).map(artist => (
              <div key={artist.id} style={{ textAlign: 'center' }}>
                <a href={artist.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                  <p style={{ fontSize: '12px' }}>{artist.name}</p>
                </a>
                {artist.isFollowing ? (
                  <button onClick={() => toggleFollowArtist(artist.id, false, 'genreArtists', genre)}>Dejar de Seguir</button>
                ) : (
                  <button onClick={() => toggleFollowArtist(artist.id, true, 'genreArtists', genre)}>Seguir</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
