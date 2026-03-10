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

  return (
    <div className="court-card court-card--horizontal">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 flex justify-between items-center">
        <h3 className="text-white font-bold">Court {courtNumber}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          match.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {match.status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <div className="court-surface court-surface--horizontal">
        <div className="court-boundary-h"></div>

        <div className="court-team court-team--left">
          {match.team1Players.map(player => (
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

        <div className="court-net-vertical">
          <div className="court-score-horizontal">
            {match.status === 'completed' ? (
              <span className="font-bold text-lg">{match.team1Score} - {match.team2Score}</span>
            ) : (
              <span className="font-bold text-orange-500">VS</span>
            )}
          </div>
          <div className="net-label-v">NET</div>
        </div>

        <div className="court-team court-team--right">
          {match.team2Players.map(player => (
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

      {match.status !== 'completed' && (
        <div className="p-3 bg-gray-50 border-t">
          {showScoreInput ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                placeholder="Team 1"
                className="w-20 px-2 py-1 border rounded text-center"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                placeholder="Team 2"
                className="w-20 px-2 py-1 border rounded text-center"
              />
              <button
                onClick={handleSubmitScore}
                className="btn-primary text-sm py-1 px-3"
              >
                Save
              </button>
              <button
                onClick={() => setShowScoreInput(false)}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowScoreInput(true)}
              className="w-full btn-secondary text-sm"
            >
              Enter Score
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourtCard;
