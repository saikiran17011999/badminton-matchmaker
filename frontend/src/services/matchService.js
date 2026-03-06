import api from './api';

export const updateMatchScore = async (eventId, matchId, team1Score, team2Score) => {
  const response = await api.put(`/events/${eventId}/matches/${matchId}`, {
    team1Score,
    team2Score
  });
  return response.data;
};

export const swapPlayers = async (eventId, player1Id, player2Id, roundNumber) => {
  const response = await api.post(`/events/${eventId}/matches/swap`, {
    player1Id,
    player2Id,
    roundNumber
  });
  return response.data;
};
