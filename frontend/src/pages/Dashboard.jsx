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

  /* ── Logic unchanged ── */
  const {
    selectedPlayers,
    selectPlayer,
    executeSwap,
    cancelSwap,
    isSelected,
    canSwap,
  } = useSwap(eventId, event?.currentRound, () => fetchEvent(eventId));

  useEffect(() => {
    fetchEvent(eventId).catch(() => navigate('/'));
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
    if (event?.currentRound > 1) goToRound(event.currentRound - 1);
  };

  const handleNextRound = () => {
    if (event?.currentRound < event?.totalRounds) goToRound(event.currentRound + 1);
  };

  /* ── Loading state ── */
  if (loading && !event) {
    return (
      <div className="loading-screen">
        <span className="loading-shuttle">🏸</span>
        <p className="loading-text">Loading event…</p>
      </div>
    );
  }

  /* ── Error state ── */
  if (error && !event) {
    return (
      <div className="loading-screen">
        <span style={{ fontSize: '3.5rem' }}>😕</span>
        <p style={{ color: 'var(--red)', marginBottom: '1rem', fontFamily: 'Rajdhani', fontSize: '1.1rem' }}>
          {error}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          ← Go Back
        </button>
      </div>
    );
  }

  if (!event) return null;

  const matches = event.currentRoundData?.matches || [];
  const restingPlayers = event.currentRoundData?.restingPlayers || [];
  const typeCap = event.type.charAt(0).toUpperCase() + event.type.slice(1);

  /* ── Premium UI ── */
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Sticky header ── */}
      <header className="dashboard-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🏸</span>
            <div>
              <h1 className="header-title">Badminton Matchmaker</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="header-badge">{typeCap}</span>
                <span className="header-badge">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {event.numCourts} Courts
                </span>
                <span className="header-badge">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.players.length} Players
                </span>
              </div>
            </div>
          </div>

          {/* Manage players toggle */}
          <button
            onClick={() => setShowPlayerPanel(!showPlayerPanel)}
            className={`manage-btn ${showPlayerPanel ? 'manage-btn--active' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            {showPlayerPanel ? 'Hide' : 'Players'}
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Courts area */}
          <div className="flex-1 min-w-0">

            {/* ── Pre-game state ── */}
            {event.currentRound === 0 ? (
              <div className="start-state">
                <span className="start-state-icon">🏸</span>
                <h2 className="start-state-title">Ready to Start?</h2>
                <p className="start-state-desc">
                  You have{' '}
                  <strong style={{ color: 'var(--primary)' }}>{event.players.length}</strong>{' '}
                  players registered.
                  {event.type === 'doubles' && event.players.length < 4 && (
                    <span className="start-state-warn">
                      ⚠ Need at least 4 players for doubles.
                    </span>
                  )}
                  {event.type === 'singles' && event.players.length < 2 && (
                    <span className="start-state-warn">
                      ⚠ Need at least 2 players for singles.
                    </span>
                  )}
                </p>
                <button
                  onClick={generateNextRound}
                  disabled={
                    loading ||
                    (event.type === 'doubles' && event.players.length < 4) ||
                    (event.type === 'singles' && event.players.length < 2)
                  }
                  className="btn-primary text-xl px-10 py-4"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    '⚡ Generate First Round'
                  )}
                </button>
              </div>
            ) : (
              <>
                {/* Round nav */}
                <div className="mb-5">
                  <RoundNavigation
                    currentRound={event.currentRound}
                    totalRounds={event.totalRounds}
                    onPrevious={handlePreviousRound}
                    onNext={handleNextRound}
                    onGenerate={generateNextRound}
                    loading={loading}
                  />
                </div>

                {/* Court grid */}
                {matches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    {matches.map((match, i) => (
                      <div
                        key={match.id}
                        style={{ animationDelay: `${i * 0.07}s` }}
                      >
                        <CourtCard
                          match={match}
                          courtNumber={match.courtNumber}
                          onPlayerClick={selectPlayer}
                          isPlayerSelected={isSelected}
                          onScoreSubmit={handleScoreSubmit}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-10"
                    style={{ color: 'var(--text-2)', fontFamily: 'Rajdhani', fontSize: '1rem', letterSpacing: '.1em' }}
                  >
                    NO MATCHES IN THIS ROUND
                  </div>
                )}

                {/* Resting area */}
                <RestingArea
                  players={restingPlayers}
                  onPlayerClick={selectPlayer}
                  isPlayerSelected={isSelected}
                />
              </>
            )}
          </div>

          {/* Player panel sidebar */}
          {showPlayerPanel && (
            <div className="w-72 flex-shrink-0">
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

      {/* Swap indicator */}
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