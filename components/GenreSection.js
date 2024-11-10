// Ruta: components/GenreSection.js
import React from 'react';
import ArtistCard from './ArtistCard';

const GenreSection = ({ genres }) => {
  return (
    <section>
      <h2>Top Géneros Escuchados</h2>
      <div className="genres-container">
        {/* Recorre cada género y muestra su título y los artistas principales */}
        {genres.map((genre, index) => (
          <div key={index} className="genre-section">
            <h3>{genre.name}</h3>
            <div className="artists-container">
              {/* Muestra los artistas de cada género en tarjetas */}
              {genre.topArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .genres-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .genre-section {
          margin-bottom: 2rem;
        }
        .artists-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
      `}</style>
    </section>
  );
};

export default GenreSection;
