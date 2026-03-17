import api from './api';

export const addPlayer = async (eventId, name, token = null) => {
  const params = token ? { token } : {};
  const response = await api.post(`/events/${eventId}/players`, { name }, { params });
  return response.data;
};

export const updatePlayer = async (eventId, playerId, name, token = null) => {
  const params = token ? { token } : {};
  const response = await api.put(`/events/${eventId}/players/${playerId}`, { name }, { params });
  return response.data;
};

export const removePlayer = async (eventId, playerId, token = null) => {
  const params = token ? { token } : {};
  const response = await api.delete(`/events/${eventId}/players/${playerId}`, { params });
  return response.data;
};

export const getPlayers = async (eventId) => {
  const response = await api.get(`/events/${eventId}/players`);
  return response.data;
};
