import { createContext, useContext, useState, useCallback } from 'react';
import * as eventService from '../services/eventService';
import * as roundService from '../services/roundService';

const EventContext = createContext(null);

// Helper to get/set admin token from localStorage
const getStoredToken = (eventId) => {
  try {
    return localStorage.getItem(`admin_token_${eventId}`);
  } catch {
    return null;
  }
};

const storeToken = (eventId, token) => {
  try {
    localStorage.setItem(`admin_token_${eventId}`, token);
  } catch {
    // localStorage not available
  }
};

export const EventProvider = ({ children }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  // Get admin token for current event
  const getAdminToken = useCallback(() => {
    return adminToken || (event ? getStoredToken(event.id) : null);
  }, [adminToken, event]);

  // Check if current user is organiser
  const isOrganiser = useCallback(() => {
    return event?.role === 'organiser';
  }, [event]);

  const fetchEvent = useCallback(async (eventId, token = null) => {
    setLoading(true);
    setError(null);
    try {
      // Try stored token if not provided
      const useToken = token || getStoredToken(eventId);
      const data = await eventService.getEvent(eventId, useToken);
      setEvent(data);
      if (useToken) {
        setAdminToken(useToken);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Store admin token when creating event
  const saveAdminToken = useCallback((eventId, token) => {
    storeToken(eventId, token);
    setAdminToken(token);
  }, []);

  const generateNextRound = useCallback(async () => {
    if (!event) return;
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      const roundData = await roundService.generateRound(event.id, token);
      await fetchEvent(event.id, token);
      return roundData;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate round');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [event, fetchEvent, getAdminToken]);

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
    goToRound,
    isOrganiser,
    getAdminToken,
    saveAdminToken
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
