import { useState } from 'react';
import PlayerCard from './PlayerCard';
import ScrollPicker from './ScrollPicker';
import { useLanguage } from '../context/LanguageContext';

const CourtCard = ({ match, courtNumber, onPlayerClick, isPlayerSelected, onScoreSubmit }) => {
  const { t } = useLanguage();
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Score values 0-30
  const scoreValues = Array.from({ length: 31 }, (_, i) => i);

  const handleOpenScoreModal = () => {
    setTeam1Score(0);
    setTeam2Score(0);
    setShowScoreModal(true);
  };

  const handleSubmitScore = () => {
    onScoreSubmit(match.id, team1Score, team2Score);
    setShowScoreModal(false);
  };

  const handleCancelScore = () => {
    setShowScoreModal(false);
  };

  const isCompleted = match.status === 'completed';

  return (
    <>
      <div className="court-card court-card--horizontal">

        {/* Header */}
        <div className="court-header">
          <span className="court-number">
            <span className="court-number-dot" />
            {t('court.court')} {courtNumber}
          </span>
          <span className={`status-badge ${isCompleted ? 'status-badge--done' : 'status-badge--live'}`}>
            {isCompleted ? t('court.completed') : t('court.live')}
          </span>
        </div>

        {/* Court surface - Horizontal layout */}
        <div className="court-surface court-surface--horizontal">

          {/* Court boundary lines */}
          <div className="court-boundary-h" aria-hidden="true" />

          {/* Team 1 - Left Side */}
          <div className="court-team court-team--left">
            <div className="team-label">{t('court.team1')}</div>
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
            <span className="net-label-v">{t('court.net')}</span>
          </div>

          {/* Team 2 - Right Side */}
          <div className="court-team court-team--right">
            <div className="team-label">{t('court.team2')}</div>
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

        {/* Score button footer */}
        {!isCompleted && (
          <div className="score-footer">
            <button
              onClick={handleOpenScoreModal}
              className="btn-secondary w-full justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('court.enterScore')}
            </button>
          </div>
        )}
      </div>

      {/* Score Modal with Blur Backdrop */}
      {showScoreModal && (
        <>
          {/* Backdrop with blur */}
          <div className="score-modal-backdrop" onClick={handleCancelScore} />

          {/* Modal */}
          <div className="score-modal">
            <div className="score-modal-header">
              <h3 className="score-modal-title">{t('court.enterScore')}</h3>
              <span className="score-modal-court">{t('court.court')} {courtNumber}</span>
            </div>

            <div className="score-modal-body">
              {/* Team 1 Score */}
              <div className="score-modal-team">
                <span className="score-modal-team-label">{t('court.team1')}</span>
                <ScrollPicker
                  values={scoreValues}
                  selectedValue={team1Score}
                  onChange={setTeam1Score}
                />
              </div>

              {/* Separator */}
              <div className="score-modal-separator">
                <span>-</span>
              </div>

              {/* Team 2 Score */}
              <div className="score-modal-team">
                <span className="score-modal-team-label">{t('court.team2')}</span>
                <ScrollPicker
                  values={scoreValues}
                  selectedValue={team2Score}
                  onChange={setTeam2Score}
                />
              </div>
            </div>

            <div className="score-modal-footer">
              <button onClick={handleCancelScore} className="score-modal-cancel">
                {t('court.cancel')}
              </button>
              <button onClick={handleSubmitScore} className="score-modal-submit">
                {t('court.saveScore')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourtCard;
