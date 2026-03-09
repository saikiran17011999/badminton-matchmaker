import { useState } from 'react';
import PlayerCard from './PlayerCard';

const CourtCard = ({ match, courtNumber, onPlayerClick, isPlayerSelected, onScoreSubmit }) => {
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [showScoreInput, setShowScoreInput] = useState(false);

  /* ── Logic unchanged ── */
  const handleSubmitScore = () => {
    if (team1Score !== '' && team2Score !== '') {
      onScoreSubmit(match.id, parseInt(team1Score), parseInt(team2Score));
      setShowScoreInput(false);
    }
  };

  const isCompleted = match.status === 'completed';

  return (
    <div className="court-card">

      {/* ── Header ── */}
      <div className="court-header">
        <span className="court-number">
          <span className="court-number-dot" />
          Court {courtNumber}
        </span>
        <span className={`status-badge ${isCompleted ? 'status-badge--done' : 'status-badge--live'}`}>
          {isCompleted ? '✓ Completed' : 'Live'}
        </span>
      </div>

      {/* ── Court surface ── */}
      <div className="court-surface">

        {/* Court markings (non-interactive) */}
        <div className="court-boundary" aria-hidden="true" />
        <div className="court-net"      aria-hidden="true" />
        <div className="court-ssl-top"  aria-hidden="true" />
        <div className="court-ssl-bottom" aria-hidden="true" />
        <div className="court-cl-top"   aria-hidden="true" />
        <div className="court-cl-bottom" aria-hidden="true" />

        {/* Net label */}
        <div className="net-label" aria-hidden="true">
          <span className="net-label-inner">NET</span>
        </div>

        {/* Score (completed) */}
        {isCompleted && (
          <div className="court-score">
            <div className="score-display">
              {match.team1Score}<span style={{ opacity: .5, margin: '0 3px' }}>–</span>{match.team2Score}
            </div>
          </div>
        )}

        {/* Team 1 (top half) */}
        <div className="court-half" style={{ alignItems: 'flex-end', paddingBottom: '2px' }}>
          {match.team1Players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={onPlayerClick}
              isSelected={isPlayerSelected(player.id)}
              showRating={false}
              size="small"
            />
          ))}
        </div>

        {/* spacer for net */}
        <div style={{ height: '6px' }} />

        {/* Team 2 (bottom half) */}
        <div className="court-half court-half--bottom" style={{ alignItems: 'flex-start', paddingTop: '2px' }}>
          {match.team2Players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={onPlayerClick}
              isSelected={isPlayerSelected(player.id)}
              showRating={false}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* ── Score input footer ── */}
      {!isCompleted && (
        <div className="score-footer">
          {showScoreInput ? (
            <div className="score-inputs">
              <input
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                placeholder="T1"
                className="score-input"
              />
              <span className="score-divider">–</span>
              <input
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                placeholder="T2"
                className="score-input"
              />
              <button
                onClick={handleSubmitScore}
                className="btn-primary py-1.5 px-4 text-sm"
                style={{ borderRadius: '7px', minWidth: 0 }}
              >
                Save
              </button>
              <button
                onClick={() => setShowScoreInput(false)}
                className="score-cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowScoreInput(true)}
              className="btn-secondary w-full justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Enter Score
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourtCard;