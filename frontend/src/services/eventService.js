import api from './api';

export const createEvent = async ({ type, numCourts, playerNames }) => {
  const response = await api.post('/events', { type, numCourts, playerNames });
  return response.data;
};

export const getEvent = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};
