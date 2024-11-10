import Header from '../components/Header';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/spotify/last-played')
        .then((res) => res.json())
        .then((data) => setTracks(data.tracks || []));
    }
  }, [session]);

  return (
    <>
      <Header />
      <main>
        <section className="welcome-section">
          <h1>Bienvenido a Music Butler Clone</h1>
          <p>Sigue a tus artistas favoritos y mantente al día con sus últimos lanzamientos.</p>
        </section>

        {session && (
          <section className="last-played">
            <h2>Últimas Canciones Escuchadas</h2>
            <ul>
              {tracks.map((track) => (
                <li key={track.id}>
                  {track.name} - {track.artists[0].name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <style jsx>{`
        .welcome-section,
        .last-played {
          padding: 1.5rem;
        }
      `}</style>
    </>
  );
}
