// components/ArtistCard.js

import React, { useState } from 'react';

const ArtistCard = ({ artist, onFollowToggle }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    onFollowToggle(artist.id, !isFollowing ? 'follow' : 'unfollow');
  };

  return (
    <div className="artist-card">
      <img src={artist.imageUrl} alt={artist.name} className="artist-image" />
      <h3>{artist.name}</h3>
      <p>{artist.monthlyListeners} oyentes mensuales</p>
      <button onClick={handleFollowClick} className="follow-button">
        {isFollowing ? 'Siguiendo' : 'Seguir'}
      </button>
    </div>
  );
};

export default ArtistCard;
