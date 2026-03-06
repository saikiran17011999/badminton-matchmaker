import { createContext, useContext, useState, useCallback } from 'react';
import * as eventService from '../services/eventService';
import * as roundService from '../services/roundService';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getEvent(eventId);
      setEvent(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNextRound = useCallback(async () => {
    if (!event) return;
    setLoading(true);
    setError(null);
    try {
      const roundData = await roundService.generateRound(event.id);
      await fetchEvent(event.id);
      return roundData;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate round');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [event, fetchEvent]);

  const goToRound = useCallback(async (roundNumber) => {
    if (!event) return;
    try {
      const roundData = await roundService.getRound(event.id, roundNumber);
      setEvent(prev => ({
        ...prev,
        currentRound: roundNumber,
        currentRoundData: {
          roundNumber,
          matches: roundData.matches,
          restingPlayers: roundData.restingPlayers
        }
      }));
      return roundData;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch round');
      throw err;
    }
  }, [event]);

  const value = {
    event,
    setEvent,
    loading,
    error,
    fetchEvent,
    generateNextRound,
    goToRound
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
