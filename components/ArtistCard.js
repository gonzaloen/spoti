// /components/ArtistCard.js

import React from 'react';

const ArtistCard = ({ artist }) => {
  return (
    <div>
      <h2>{artist.name}</h2>
      <p>Oyentes mensuales: {artist.monthlyListeners}</p>
    </div>
  );
};

export default ArtistCard;
