import api from './api';

export const generateRound = async (eventId, token = null) => {
  const params = token ? { token } : {};
  const response = await api.post(`/events/${eventId}/rounds/generate`, {}, { params });
  return response.data;
};

export const getRound = async (eventId, roundNumber) => {
  const response = await api.get(`/events/${eventId}/rounds/${roundNumber}`);
  return response.data;
};
