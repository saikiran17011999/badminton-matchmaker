import { useState, useCallback } from 'react';
import { swapPlayers } from '../services/matchService';

export const useSwap = (eventId, roundNumber, onSwapComplete) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [swapping, setSwapping] = useState(false);

  const selectPlayer = useCallback((playerId) => {
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
    try {
      await swapPlayers(eventId, selectedPlayers[0], selectedPlayers[1], roundNumber);
      setSelectedPlayers([]);
      if (onSwapComplete) {
        await onSwapComplete();
      }
    } catch (err) {
      console.error('Swap failed:', err);
      throw err;
    } finally {
      setSwapping(false);
    }
  }, [eventId, roundNumber, selectedPlayers, onSwapComplete]);

  const cancelSwap = useCallback(() => {
    setSelectedPlayers([]);
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
    canSwap: selectedPlayers.length === 2
  };
};
