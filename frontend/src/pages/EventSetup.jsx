import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';
import { extractNamesFromImage } from '../services/ocrService';
import { useEvent } from '../context/EventContext';
import { useLanguage } from '../context/LanguageContext';

const EventSetup = () => {
  const navigate = useNavigate();
  const { saveAdminToken } = useEvent();
  const { t, language, toggleLanguage } = useLanguage();
  const [eventType, setEventType] = useState('doubles');
  const [numCourts, setNumCourts] = useState(2);
  const [playerNames, setPlayerNames] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setError(null);

    try {
      const names = await extractNamesFromImage(file);
      if (names.length > 0) {
        // Append to existing names (or set if empty)
        setPlayerNames(prev => {
          const existing = prev.trim();
          const newNames = names.join('\n');
          return existing ? `${existing}\n${newNames}` : newNames;
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract names from image');
    } finally {
      setExtracting(false);
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

      // Save admin token for organiser access
      if (event.adminToken) {
        saveAdminToken(event.id, event.adminToken);
      }

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

        {/* ── Language toggle ── */}
        <div className="text-right mb-4" style={{ animation: 'fadeInUp .3s ease both' }}>
          <button
            onClick={toggleLanguage}
            className="manage-btn"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            🌐 {language === 'en' ? '日本語' : 'English'}
          </button>
        </div>

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
            {language === 'ja' ? 'バドミントン' : 'Badminton'}<br />
            <span>{language === 'ja' ? 'マッチメーカー' : 'Matchmaker'}</span>
          </h1>
          <p className="setup-subtitle">
            {t('setup.tagline')}
          </p>
        </div>

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit} className="setup-card">

          {/* Event Type */}
          <div className="form-section">
            <label className="form-label">{t('setup.eventType')}</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEventType('singles')}
                className={`type-btn flex-1 ${eventType === 'singles' ? 'type-btn--active' : ''}`}
              >
                <span className="type-btn-icon">🧍</span>
                <span className="type-btn-label">{t('dashboard.singles')}</span>
              </button>
              <button
                type="button"
                onClick={() => setEventType('doubles')}
                className={`type-btn flex-1 ${eventType === 'doubles' ? 'type-btn--active' : ''}`}
              >
                <span className="type-btn-icon">👥</span>
                <span className="type-btn-label">{t('dashboard.doubles')}</span>
              </button>
            </div>
          </div>

          {/* Number of Courts */}
          <div className="form-section">
            <label className="form-label">{t('setup.numberOfCourts')}</label>
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
                <span className="counter-label">{t('setup.courtsLabel')}</span>
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
            <div className="flex items-center justify-between mb-2">
              <label className="form-label" style={{ marginBottom: 0 }}>
                {t('dashboard.players')}
                {playerCount > 0 && (
                  <span className="player-count-badge">{playerCount}</span>
                )}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={extracting}
                className="camera-btn"
                title={language === 'ja' ? '写真から名前を読み取る' : 'Extract names from photo'}
              >
                {extracting ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <textarea
              value={playerNames}
              onChange={(e) => setPlayerNames(e.target.value)}
              placeholder={language === 'ja' ? '田中\n鈴木\n佐藤\n山田\n...' : 'Alice\nBob\nCharlie\nDiana\n...'}
              className="players-textarea"
            />
            <p className="form-hint">{language === 'ja' ? '1行に1人の選手名、または📷で写真から読み取り' : 'One player per line, or use 📷 to scan from photo'}</p>
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
                {t('setup.creatingEvent')}
              </>
            ) : (
              `🏸 ${t('setup.startEvent')}`
            )}
          </button>
        </form>

        <p
          className="text-center mt-6"
          style={{ color: 'var(--text-3)', fontSize: '.82rem' }}
        >
          {language === 'ja' ? '選手はあとから追加できます' : 'You can always add more players later'}
        </p>
      </div>
    </div>
  );
};

export default EventSetup;