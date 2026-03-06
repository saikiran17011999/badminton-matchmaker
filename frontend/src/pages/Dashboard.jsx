import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { useSwap } from '../hooks/useSwap';
import { addPlayer, updatePlayer, removePlayer } from '../services/playerService';
import { updateMatchScore } from '../services/matchService';
import CourtCard from '../components/CourtCard';
import RestingArea from '../components/RestingArea';
import RoundNavigation from '../components/RoundNavigation';
import PlayerPanel from '../components/PlayerPanel';
import SwapIndicator from '../components/SwapIndicator';

const Dashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { event, loading, error, fetchEvent, generateNextRound, goToRound } = useEvent();
  const [showPlayerPanel, setShowPlayerPanel] = useState(false);

  const {
    selectedPlayers,
    selectPlayer,
    executeSwap,
    cancelSwap,
    isSelected,
    canSwap
  } = useSwap(
    eventId,
    event?.currentRound,
    () => fetchEvent(eventId)
  );

  useEffect(() => {
    fetchEvent(eventId).catch(() => {
      navigate('/');
    });
  }, [eventId, fetchEvent, navigate]);

  const handleAddPlayer = async (name) => {
    try {
      await addPlayer(eventId, name);
      await fetchEvent(eventId);
    } catch (err) {
      console.error('Failed to add player:', err);
    }
  };

  const handleUpdatePlayer = async (playerId, name) => {
    try {
      await updatePlayer(eventId, playerId, name);
      await fetchEvent(eventId);
    } catch (err) {
      console.error('Failed to update player:', err);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    try {
      await removePlayer(eventId, playerId);
      await fetchEvent(eventId);
    } catch (err) {
      console.error('Failed to remove player:', err);
    }
  };

  const handleScoreSubmit = async (matchId, team1Score, team2Score) => {
    try {
      await updateMatchScore(eventId, matchId, team1Score, team2Score);
      await fetchEvent(eventId);
    } catch (err) {
      console.error('Failed to update score:', err);
    }
  };

  const handlePreviousRound = () => {
    if (event?.currentRound > 1) {
      goToRound(event.currentRound - 1);
    }
  };

  const handleNextRound = () => {
    if (event?.currentRound < event?.totalRounds) {
      goToRound(event.currentRound + 1);
    }
  };

  if (loading && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏸</div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const matches = event.currentRoundData?.matches || [];
  const restingPlayers = event.currentRoundData?.restingPlayers || [];

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏸</span>
            <div>
              <h1 className="font-bold text-gray-800">Badminton Matchmaker</h1>
              <p className="text-sm text-gray-500">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)} | {event.numCourts} Courts | {event.players.length} Players
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPlayerPanel(!showPlayerPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showPlayerPanel ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Manage Players
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className={`flex-1 ${showPlayerPanel ? 'w-2/3' : 'w-full'}`}>
            {event.currentRound === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🏸</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Start?
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You have {event.players.length} players registered.
                  {event.type === 'doubles' && event.players.length < 4 && (
                    <span className="text-orange-500 block mt-2">
                      Need at least 4 players for doubles.
                    </span>
                  )}
                  {event.type === 'singles' && event.players.length < 2 && (
                    <span className="text-orange-500 block mt-2">
                      Need at least 2 players for singles.
                    </span>
                  )}
                </p>
                <button
                  onClick={generateNextRound}
                  disabled={loading || (event.type === 'doubles' && event.players.length < 4) || (event.type === 'singles' && event.players.length < 2)}
                  className="btn-primary text-xl px-8 py-4"
                >
                  {loading ? 'Generating...' : 'Generate First Round'}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <RoundNavigation
                    currentRound={event.currentRound}
                    totalRounds={event.totalRounds}
                    onPrevious={handlePreviousRound}
                    onNext={handleNextRound}
                    onGenerate={generateNextRound}
                    loading={loading}
                  />
                </div>

                {matches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {matches.map((match) => (
                      <CourtCard
                        key={match.id}
                        match={match}
                        courtNumber={match.courtNumber}
                        onPlayerClick={selectPlayer}
                        isPlayerSelected={isSelected}
                        onScoreSubmit={handleScoreSubmit}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No matches in this round.
                  </div>
                )}

                <RestingArea
                  players={restingPlayers}
                  onPlayerClick={selectPlayer}
                  isPlayerSelected={isSelected}
                />
              </>
            )}
          </div>

          {showPlayerPanel && (
            <div className="w-80 flex-shrink-0">
              <PlayerPanel
                players={event.players}
                onAddPlayer={handleAddPlayer}
                onUpdatePlayer={handleUpdatePlayer}
                onRemovePlayer={handleRemovePlayer}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>

      <SwapIndicator
        selectedCount={selectedPlayers.length}
        onSwap={executeSwap}
        onCancel={cancelSwap}
        canSwap={canSwap}
      />
    </div>
  );
};

export default Dashboard;
