import { useState } from 'react';
import PlayerCard from './PlayerCard';

const CourtCard = ({ match, courtNumber, onPlayerClick, isPlayerSelected, onScoreSubmit }) => {
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [showScoreInput, setShowScoreInput] = useState(false);

  const handleSubmitScore = () => {
    if (team1Score !== '' && team2Score !== '') {
      onScoreSubmit(match.id, parseInt(team1Score), parseInt(team2Score));
      setShowScoreInput(false);
    }
  };

  const isCompleted = match.status === 'completed';

  return (
    <div className="court-card court-card--horizontal">

      {/* Header */}
      <div className="court-header">
        <span className="court-number">
          <span className="court-number-dot" />
          Court {courtNumber}
        </span>
        <span className={`status-badge ${isCompleted ? 'status-badge--done' : 'status-badge--live'}`}>
          {isCompleted ? 'Completed' : 'Live'}
        </span>
      </div>

      {/* Court surface - Horizontal layout */}
      <div className="court-surface court-surface--horizontal">

        {/* Court boundary lines */}
        <div className="court-boundary-h" aria-hidden="true" />

        {/* Team 1 - Left Side */}
        <div className="court-team court-team--left">
          <div className="team-label">Team 1</div>
          <div className="team-players">
            {match.team1Players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={onPlayerClick}
                isSelected={isPlayerSelected(player.id)}
                showRating={false}
                size="medium"
              />
            ))}
          </div>
        </div>

        {/* Net - Vertical in center */}
        <div className="court-net-vertical">
          <span className="net-label-v">NET</span>
        </div>

        {/* Team 2 - Right Side */}
        <div className="court-team court-team--right">
          <div className="team-label">Team 2</div>
          <div className="team-players">
            {match.team2Players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={onPlayerClick}
                isSelected={isPlayerSelected(player.id)}
                showRating={false}
                size="medium"
              />
            ))}
          </div>
        </div>

        {/* Score overlay when completed */}
        {isCompleted && (
          <div className="court-score-horizontal">
            <span className="score-team">{match.team1Score}</span>
            <span className="score-separator">-</span>
            <span className="score-team">{match.team2Score}</span>
          </div>
        )}
      </div>

      {/* Score input footer */}
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
              <span className="score-divider">-</span>
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
                X
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
