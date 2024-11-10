// Componente para mostrar la información básica de cada artista
// Utilizado en la página principal para cada sección de artistas

import React from 'react';

const ArtistCard = ({ artist }) => {
  return (
    <div className="artist-card">
      {/* Muestra la imagen del artista si está disponible */}
      {artist.image && <img src={artist.image} alt={`${artist.name}`} className="artist-image" />}
      <h2>{artist.name}</h2>
      
      {/* Muestra el número de oyentes mensuales si está disponible */}
      {artist.listeners && <p>Oyentes mensuales: {artist.listeners}</p>}
      
      {/* Enlace al perfil de Spotify del artista */}
      {artist.spotifyUrl && (
        <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="spotify-link">
          Ver en Spotify
        </a>
      )}
      
      {/* Estilos adicionales para la tarjeta */}
      <style jsx>{`
        .artist-card {
          border: 1px solid #ccc;
          padding: 1rem;
          text-align: center;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        
        .artist-card:hover {
          transform: scale(1.05);
        }

        .artist-image {
          width: 100%;
          height: auto;
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .spotify-link {
          display: inline-block;
          margin-top: 0.5rem;
          color: #1db954;
          text-decoration: none;
        }

        .spotify-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ArtistCard;
