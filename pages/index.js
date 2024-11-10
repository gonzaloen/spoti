// /pages/index.js
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { getRecentlyPlayedArtists, getFollowedArtists, getGenres, getTopArtistsByGenre } from '../lib/api';
import ArtistCard from '../components/ArtistCard';
import GenreSection from '../components/GenreSection';

export default function Home({ session }) {
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [followedLocalArtists, setFollowedLocalArtists] = useState([]);

  useEffect(() => {
    if (session) {
      // Fetch Recently Played Artists from Spotify
      getRecentlyPlayedArtists().then(setRecentlyPlayedArtists);
      // Fetch Followed Artists from Spotify
      getFollowedArtists().then(setFollowedArtists);
      // Fetch Top Genres and their Artists
      getGenres().then(setTopGenres);
    }
  }, [session]);

  // Handle local follow/unfollow logic
  const handleLocalFollowToggle = (artist) => {
    setFollowedLocalArtists((prev) => {
      const isAlreadyFollowing = prev.find((a) => a.id === artist.id);
      if (isAlreadyFollowing) {
        return prev.filter((a) => a.id !== artist.id);
      }
      return [...prev, artist];
    });
  };

  return (
    <div>
      {/* Sección: Últimos Artistas Escuchados en Spotify */}
      <section>
        <h2>Últimos Artistas Escuchados en Spotify</h2>
        <div className="artist-grid">
          {recentlyPlayedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Sección: Últimos Artistas Seguidos en Spotify */}
      <section>
        <h2>Últimos Artistas Seguidos en Spotify</h2>
        <div className="artist-grid">
          {followedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Sección: Géneros Más Escuchados */}
      <section>
        <h2>Géneros Más Escuchados</h2>
        {topGenres.map((genre) => (
          <GenreSection key={genre.name} genre={genre} />
        ))}
      </section>

      {/* Sección: Artistas Seguidos en Nuestra App */}
      <section>
        <h2>Artistas Seguidos en Nuestra App</h2>
        <div className="artist-grid">
          {followedLocalArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
        {/* Botón Seguir / Siguiendo */}
        <div className="artist-grid">
          {recentlyPlayedArtists.map((artist) => (
            <div key={artist.id}>
              <ArtistCard artist={artist} />
              <button
                onClick={() => handleLocalFollowToggle(artist)}
                style={{ marginTop: '10px' }}
              >
                {followedLocalArtists.find((a) => a.id === artist.id)
                  ? 'Siguiendo'
                  : 'Seguir'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Fetch session on server-side
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
