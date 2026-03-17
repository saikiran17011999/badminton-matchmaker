import { useState, useCallback } from 'react';
import { swapPlayers } from '../services/matchService';

export const useSwap = (eventId, roundNumber, onSwapComplete, getToken = null) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [swapping, setSwapping] = useState(false);
  const [swapError, setSwapError] = useState(null);

  const selectPlayer = useCallback((playerId) => {
    setSwapError(null);
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      }
      if (prev.length >= 2) {
        return [playerId];
      }
      return [...prev, playerId];
    });
  }, []);

  const executeSwap = useCallback(async () => {
    if (selectedPlayers.length !== 2) return;

    setSwapping(true);
    setSwapError(null);
    try {
      const token = getToken ? getToken() : null;
      await swapPlayers(eventId, selectedPlayers[0], selectedPlayers[1], roundNumber, token);
      setSelectedPlayers([]);
      if (onSwapComplete) {
        await onSwapComplete();
      }
    } catch (err) {
      console.error('Swap failed:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Swap failed';
      setSwapError(errorMsg);
      setTimeout(() => setSwapError(null), 3000);
    } finally {
      setSwapping(false);
    }
  }, [eventId, roundNumber, selectedPlayers, onSwapComplete, getToken]);

  const cancelSwap = useCallback(() => {
    setSelectedPlayers([]);
    setSwapError(null);
  }, []);

  const isSelected = useCallback((playerId) => {
    return selectedPlayers.includes(playerId);
  }, [selectedPlayers]);

  return {
    selectedPlayers,
    selectPlayer,
    executeSwap,
    cancelSwap,
    isSelected,
    swapping,
    swapError,
    canSwap: selectedPlayers.length === 2
  };
};
