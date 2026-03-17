import { useState, useCallback, useRef } from 'react';
import { swapPlayers } from '../services/matchService';

export const useDragSwap = (eventId, roundNumber, onSwapComplete, getToken = null) => {
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [swapping, setSwapping] = useState(false);
  const [swapError, setSwapError] = useState(null);
  const [swappedPair, setSwappedPair] = useState(null); // For animation
  const touchStartRef = useRef(null);
  const dragImageRef = useRef(null);

  const handleDragStart = useCallback((e, player) => {
    setDraggedPlayer(player);
    setSwapError(null);

    // Create custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'drag-ghost';
    dragImage.textContent = player.name;
    document.body.appendChild(dragImage);
    dragImageRef.current = dragImage;

    e.dataTransfer.setDragImage(dragImage, 50, 20);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', player.id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedPlayer(null);
    setDropTarget(null);

    // Remove drag ghost
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current);
      dragImageRef.current = null;
    }
  }, []);

  const handleDragOver = useCallback((e, player) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedPlayer && player.id !== draggedPlayer.id) {
      setDropTarget(player.id);
    }
  }, [draggedPlayer]);

  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback(async (e, targetPlayer) => {
    e.preventDefault();

    if (!draggedPlayer || draggedPlayer.id === targetPlayer.id) {
      handleDragEnd();
      return;
    }

    setSwapping(true);
    setSwapError(null);

    try {
      const token = getToken ? getToken() : null;
      await swapPlayers(eventId, draggedPlayer.id, targetPlayer.id, roundNumber, token);

      // Trigger swap animation
      setSwappedPair([draggedPlayer.id, targetPlayer.id]);
      setTimeout(() => setSwappedPair(null), 500);

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
      handleDragEnd();
    }
  }, [eventId, roundNumber, draggedPlayer, onSwapComplete, getToken, handleDragEnd]);

  // Touch events for mobile
  const handleTouchStart = useCallback((e, player) => {
    touchStartRef.current = {
      player,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      moved: false
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.startX);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.startY);

    if (deltaX > 10 || deltaY > 10) {
      touchStartRef.current.moved = true;
      if (!draggedPlayer) {
        setDraggedPlayer(touchStartRef.current.player);
      }
    }
  }, [draggedPlayer]);

  const handleTouchEnd = useCallback(async (e, targetPlayer) => {
    if (!touchStartRef.current) return;

    const wasDragging = draggedPlayer && touchStartRef.current.moved;
    const sourcePlayer = touchStartRef.current.player;

    touchStartRef.current = null;

    if (wasDragging && targetPlayer && sourcePlayer.id !== targetPlayer.id) {
      // Perform swap
      setSwapping(true);
      try {
        const token = getToken ? getToken() : null;
        await swapPlayers(eventId, sourcePlayer.id, targetPlayer.id, roundNumber, token);
        setSwappedPair([sourcePlayer.id, targetPlayer.id]);
        setTimeout(() => setSwappedPair(null), 500);
        if (onSwapComplete) {
          await onSwapComplete();
        }
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Swap failed';
        setSwapError(errorMsg);
        setTimeout(() => setSwapError(null), 3000);
      } finally {
        setSwapping(false);
      }
    }

    setDraggedPlayer(null);
    setDropTarget(null);
  }, [eventId, roundNumber, draggedPlayer, onSwapComplete, getToken]);

  const isDragging = useCallback((playerId) => {
    return draggedPlayer?.id === playerId;
  }, [draggedPlayer]);

  const isDropTarget = useCallback((playerId) => {
    return dropTarget === playerId;
  }, [dropTarget]);

  const isSwapping = useCallback((playerId) => {
    return swappedPair?.includes(playerId);
  }, [swappedPair]);

  return {
    draggedPlayer,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDragging,
    isDropTarget,
    isSwapping,
    swapping,
    swapError,
  };
};
