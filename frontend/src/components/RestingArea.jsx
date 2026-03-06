import PlayerCard from './PlayerCard';

const RestingArea = ({ players, onPlayerClick, isPlayerSelected }) => {
  if (!players || players.length === 0) {
    return null;
  }

  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-2xl">🪑</span>
        Resting Players
      </h3>
      <div className="flex flex-wrap gap-2">
        {players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            onClick={onPlayerClick}
            isSelected={isPlayerSelected?.(player.id)}
            showRating={false}
            size="small"
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-3">
        These players will have priority in the next round.
      </p>
    </div>
  );
};

export default RestingArea;
