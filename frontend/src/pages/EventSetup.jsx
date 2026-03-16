import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';

const EventSetup = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState('doubles');
  const [numCourts, setNumCourts] = useState(2);
  const [playerNames, setPlayerNames] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── Logic unchanged ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const names = playerNames
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      const event = await createEvent({
        type: eventType,
        numCourts: parseInt(numCourts),
        playerNames: names,
      });

      navigate(`/event/${event.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const playerCount = playerNames.split('\n').filter(n => n.trim()).length;

  /* ── Premium UI ── */
  return (
    <div className="setup-page min-h-screen flex items-center justify-center p-6">
      {/* Faint diagonal court stripes */}
      <div className="setup-court-bg" aria-hidden="true" />

      <div className="w-full max-w-lg relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-10" style={{ animation: 'fadeInUp .5s ease both' }}>
          <span
            className="block text-7xl mb-5 shuttlecock-icon"
            role="img"
            aria-label="shuttlecock"
          >
            🏸
          </span>
          <h1 className="setup-title">
            Badminton<br />
            <span>Matchmaker</span>
          </h1>
          <p className="setup-subtitle">
            Create fair matches automatically for your badminton event
          </p>
        </div>

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit} className="setup-card">

          {/* Event Type */}
          <div className="form-section">
            <label className="form-label">Event Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEventType('singles')}
                className={`type-btn flex-1 ${eventType === 'singles' ? 'type-btn--active' : ''}`}
              >
                <span className="type-btn-icon">🧍</span>
                <span className="type-btn-label">Singles</span>
              </button>
              <button
                type="button"
                onClick={() => setEventType('doubles')}
                className={`type-btn flex-1 ${eventType === 'doubles' ? 'type-btn--active' : ''}`}
              >
                <span className="type-btn-icon">👥</span>
                <span className="type-btn-label">Doubles</span>
              </button>
            </div>
          </div>

          {/* Number of Courts */}
          <div className="form-section">
            <label className="form-label">Number of Courts</label>
            <div className="courts-counter">
              <button
                type="button"
                onClick={() => setNumCourts(Math.max(1, numCourts - 1))}
                className="counter-btn"
                aria-label="Decrease courts"
              >
                −
              </button>
              <div className="counter-value">
                <span className="counter-number">{numCourts}</span>
                <span className="counter-label">courts</span>
              </div>
              <button
                type="button"
                onClick={() => setNumCourts(numCourts + 1)}
                className="counter-btn"
                aria-label="Increase courts"
              >
                +
              </button>
            </div>
          </div>

          {/* Players */}
          <div className="form-section">
            <label className="form-label">
              Players
              {playerCount > 0 && (
                <span className="player-count-badge">{playerCount}</span>
              )}
            </label>
            <textarea
              value={playerNames}
              onChange={(e) => setPlayerNames(e.target.value)}
              placeholder={'Alice\nBob\nCharlie\nDiana\n...'}
              className="players-textarea"
            />
            <p className="form-hint">One player name per line</p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xl py-4 mt-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating Event…
              </>
            ) : (
              '🏸 START EVENT'
            )}
          </button>
        </form>

        <p
          className="text-center mt-6"
          style={{ color: 'var(--text-3)', fontSize: '.82rem' }}
        >
          You can always add more players later
        </p>
      </div>
    </div>
  );
};

export default EventSetup;