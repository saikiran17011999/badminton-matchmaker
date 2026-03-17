import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { useLanguage } from '../context/LanguageContext';
import { useDragSwap } from '../hooks/useDragSwap';
import { addPlayer, updatePlayer, removePlayer } from '../services/playerService';
import { updateMatchScore } from '../services/matchService';
import CourtCard from '../components/CourtCard';
import RestingArea from '../components/RestingArea';
import RoundNavigation from '../components/RoundNavigation';
import PlayerPanel from '../components/PlayerPanel';
import NavDrawer from '../components/NavDrawer';

const Dashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { event, loading, error, fetchEvent, generateNextRound, goToRound, isOrganiser, getAdminToken } = useEvent();
  const { language, toggleLanguage, t } = useLanguage();
  const [showPlayerPanel, setShowPlayerPanel] = useState(false);
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  /* ── Drag-and-drop swap ── */
  const dragSwap = useDragSwap(eventId, event?.currentRound, () => fetchEvent(eventId, getAdminToken()), getAdminToken);
  const { swapError, draggedPlayer } = dragSwap;

  useEffect(() => {
    fetchEvent(eventId).catch(() => navigate('/'));
  }, [eventId, fetchEvent, navigate]);

  const handleAddPlayer = async (name) => {
    try {
      const token = getAdminToken();
      await addPlayer(eventId, name, token);
      await fetchEvent(eventId, token);
    } catch (err) {
      console.error('Failed to add player:', err);
    }
  };

  const handleUpdatePlayer = async (playerId, name) => {
    try {
      const token = getAdminToken();
      await updatePlayer(eventId, playerId, name, token);
      await fetchEvent(eventId, token);
    } catch (err) {
      console.error('Failed to update player:', err);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    try {
      const token = getAdminToken();
      await removePlayer(eventId, playerId, token);
      await fetchEvent(eventId, token);
    } catch (err) {
      console.error('Failed to remove player:', err);
    }
  };

  const handleScoreSubmit = async (matchId, team1Score, team2Score) => {
    try {
      const token = getAdminToken();
      await updateMatchScore(eventId, matchId, team1Score, team2Score, token);
      await fetchEvent(eventId, token);
    } catch (err) {
      console.error('Failed to update score:', err);
    }
  };

  // Copy share link to clipboard
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
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
        <p className="loading-text">{t('app.loading')}</p>
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
          ← {t('app.goBack')}
        </button>
      </div>
    );
  }

  if (!event) return null;

  const matches = event.currentRoundData?.matches || [];
  const restingPlayers = event.currentRoundData?.restingPlayers || [];
  const typeCap = event.type === 'doubles' ? t('dashboard.doubles') : t('dashboard.singles');

  /* ── Premium UI ── */
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Sticky header ── */}
      <header className="dashboard-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Left side: Hamburger + Brand */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu */}
            <button
              onClick={() => setShowNavDrawer(true)}
              className="hamburger-btn"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Brand */}
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🏸</span>
            <div>
              <h1 className="header-title">{t('app.title')}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="header-badge">{typeCap}</span>
                <span className="header-badge">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {event.numCourts} {t('dashboard.courts')}
                </span>
                <span className="header-badge">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.players.length} {t('dashboard.players')}
                </span>
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Role indicator */}
            <span className={`role-badge ${isOrganiser() ? 'role-badge--organiser' : 'role-badge--viewer'}`}>
              {isOrganiser() ? `🔑 ${t('role.organiser')}` : `👁 ${t('role.viewer')}`}
            </span>

            {/* Share button - always visible */}
            <button
              onClick={handleShare}
              className="manage-btn"
              aria-label={t('share.button')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t('share.button')}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="manage-btn"
              aria-label="Toggle language"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {language === 'en' ? '日本語' : 'EN'}
            </button>

            {/* Manage players toggle - only for organiser */}
            {isOrganiser() && (
              <button
                onClick={() => setShowPlayerPanel(!showPlayerPanel)}
                className={`manage-btn ${showPlayerPanel ? 'manage-btn--active' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {showPlayerPanel ? t('dashboard.hide') : t('dashboard.players')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Courts area - full width now */}
        <div className="w-full">

          {/* ── Pre-game state ── */}
          {event.currentRound === 0 ? (
              <div className="start-state">
                <span className="start-state-icon">🏸</span>
                <h2 className="start-state-title">{t('start.readyToStart')}</h2>
                <p className="start-state-desc">
                  <strong style={{ color: 'var(--primary)' }}>{event.players.length}</strong>{' '}
                  {t('start.playersRegistered')}
                  {event.type === 'doubles' && event.players.length < 4 && (
                    <span className="start-state-warn">
                      ⚠ {t('start.needDoublesPlayers')}
                    </span>
                  )}
                  {event.type === 'singles' && event.players.length < 2 && (
                    <span className="start-state-warn">
                      ⚠ {t('start.needSinglesPlayers')}
                    </span>
                  )}
                </p>
                {isOrganiser() ? (
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
                        {t('start.generating')}
                      </>
                    ) : (
                      <>⚡ {t('start.generateFirstRound')}</>
                    )}
                  </button>
                ) : (
                  <p className="viewer-waiting-msg">
                    ⏳ {t('role.waitingForOrganiser')}
                  </p>
                )}
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
                    onGenerate={isOrganiser() ? generateNextRound : null}
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
                          isPlayerSelected={() => false}
                          onScoreSubmit={isOrganiser() ? handleScoreSubmit : undefined}
                          readOnly={!isOrganiser()}
                          dragHandlers={isOrganiser() ? dragSwap : null}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-10"
                    style={{ color: 'var(--text-2)', fontFamily: 'Rajdhani', fontSize: '1rem', letterSpacing: '.1em' }}
                  >
                    {t('court.noMatches')}
                  </div>
                )}

                {/* Resting area */}
                <RestingArea
                  players={restingPlayers}
                  isPlayerSelected={() => false}
                  dragHandlers={isOrganiser() ? dragSwap : null}
                />
              </>
            )}
        </div>
      </div>

      {/* Player panel overlay with glassmorphism */}
      {showPlayerPanel && (
        <>
          {/* Backdrop */}
          <div
            className="player-panel-backdrop"
            onClick={() => setShowPlayerPanel(false)}
          />
          {/* Panel */}
          <div className="player-panel-overlay">
            <div className="player-panel-overlay-header">
              <span className="panel-title" style={{ marginBottom: 0 }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('dashboard.managePlayers')}
              </span>
              <button
                className="panel-close-btn"
                onClick={() => setShowPlayerPanel(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PlayerPanel
              players={event.players}
              onAddPlayer={handleAddPlayer}
              onUpdatePlayer={handleUpdatePlayer}
              onRemovePlayer={handleRemovePlayer}
              loading={loading}
              isOverlay={true}
            />
          </div>
        </>
      )}

      {/* Drag status indicator - only for organiser */}
      {isOrganiser() && (draggedPlayer || swapError) && (
        <div className={`swap-bar ${swapError ? 'swap-bar--error' : ''}`}>
          {swapError ? (
            <>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span>
              <span className="swap-text" style={{ color: 'var(--red)' }}>
                {swapError}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.1rem' }}>🎯</span>
              <span className="swap-text">
                {t('swap.dropToSwap')} <strong>{draggedPlayer?.name}</strong>
              </span>
            </>
          )}
        </div>
      )}

      {/* Navigation drawer */}
      <NavDrawer
        isOpen={showNavDrawer}
        onClose={() => setShowNavDrawer(false)}
      />

      {/* Share modal toast */}
      {showShareModal && (
        <div className="share-toast">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 13l4 4L19 7" />
          </svg>
          {t('share.copied')}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
