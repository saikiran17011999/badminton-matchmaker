import api from './api';

export const createEvent = async ({ type, numCourts, playerNames }) => {
  const response = await api.post('/events', { type, numCourts, playerNames });
  return response.data;
};

export const getEvent = async (eventId, token = null) => {
  const params = token ? { token } : {};
  const response = await api.get(`/events/${eventId}`, { params });
  return response.data;
};

export const getEventByShareCode = async (shareCode) => {
  const response = await api.get(`/events/join/${shareCode}`);
  return response.data;
};

export const deleteEvent = async (eventId, token) => {
  const response = await api.delete(`/events/${eventId}`, { params: { token } });
  return response.data;
};
