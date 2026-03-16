import PlayerCard from './PlayerCard';

const RestingArea = ({ players, onPlayerClick, isPlayerSelected }) => {
  if (!players || players.length === 0) return null;

  return (
    <div className="resting-card">
      <h3 className="resting-title">
        {/* Bench icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17h18M5 17V9a2 2 0 012-2h10a2 2 0 012 2v8M8 17v2m8-2v2" />
        </svg>
        On the Bench
        <span
          style={{
            marginLeft: 'auto',
            background: 'rgba(245,158,11,.12)',
            border: '1px solid rgba(245,158,11,.25)',
            borderRadius: '99px',
            padding: '.1rem .55rem',
            fontSize: '.7rem',
            fontWeight: 700,
            color: 'var(--accent)',
          }}
        >
          {players.length}
        </span>
      </h3>

      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
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

      <p className="resting-hint">
        ⬆ These players have priority in the next round
      </p>
    </div>
  );
};

export default RestingArea;