import api from './api';

export const addPlayer = async (eventId, name) => {
  const response = await api.post(`/events/${eventId}/players`, { name });
  return response.data;
};

export const updatePlayer = async (eventId, playerId, name) => {
  const response = await api.put(`/events/${eventId}/players/${playerId}`, { name });
  return response.data;
};

export const removePlayer = async (eventId, playerId) => {
  const response = await api.delete(`/events/${eventId}/players/${playerId}`);
  return response.data;
};

export const getPlayers = async (eventId) => {
  const response = await api.get(`/events/${eventId}/players`);
  return response.data;
};
