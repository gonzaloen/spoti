// lib/api.js

import axios from 'axios';

// Función para obtener los últimos artistas escuchados en Spotify
export const fetchRecentlyPlayedArtists = async () => {
  try {
    const response = await axios.get('/api/recentlyPlayed');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los últimos artistas escuchados:', error);
    return [];
  }
};

// Función para obtener el número de oyentes mensuales de un artista
export const fetchArtistDetails = async (artistId) => {
  try {
    const response = await axios.get(`/api/artistDetails?artistId=${artistId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles del artista:', error);
    return null;
  }
};

// Función para alternar el estado de seguimiento de un artista
export const toggleFollowArtist = async (artistId, action) => {
  try {
    const response = await axios.post(`/api/toggleFollow`, { artistId, action });
    return response.data;
  } catch (error) {
    console.error('Error al seguir/dejar de seguir al artista:', error);
    return { error: 'Error al procesar la solicitud', details: error.message };
  }
};
