// Componente para mostrar la información básica de cada artista
// Utilizado en la página principal para cada sección de artistas

import React from 'react';

const ArtistCard = ({ artist }) => {
  return (
    <div className="artist-card">
      <h2>{artist.name}</h2>
      {artist.listeners && <p>Oyentes mensuales: {artist.listeners}</p>}
    </div>
  );
};

export default ArtistCard;
