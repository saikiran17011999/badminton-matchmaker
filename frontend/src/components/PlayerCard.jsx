/* Deterministic avatar color: cycles through 8 gradients */
const AVATAR_CLASSES = ['av-0','av-1','av-2','av-3','av-4','av-5','av-6','av-7'];

const getAvatarClass = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_CLASSES[Math.abs(hash) % AVATAR_CLASSES.length];
};

const PlayerCard = ({ player, onClick, isSelected, showRating = true, size = 'normal' }) => {
  const avClass = getAvatarClass(player.name);
  const initial = player.name.charAt(0).toUpperCase();

  /* size variants */
  const isSmall  = size === 'small';
  const isLarge  = size === 'large';

  const chipClass = isSmall
    ? `player-chip ${isSelected ? 'selected' : ''}`
    : `player-chip-normal player-chip ${isSelected ? 'selected' : ''}`;

  const avatarSizeClass = isSmall ? 'player-avatar player-avatar-sm' : isLarge ? 'player-avatar player-avatar-lg' : 'player-avatar';

  return (
    <div
      onClick={() => onClick?.(player.id)}
      className={chipClass}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(player.id)}
    >
      <div className={`${avatarSizeClass} ${avClass}`}>
        {initial}
      </div>

      <div>
        <p className={`player-name ${isSmall ? 'player-name-sm' : ''}`}>
          {player.name}
        </p>
        {showRating && player.rating !== undefined && (
          <p className="player-rating">Lvl {player.rating}</p>
        )}
      </div>

      {/* selection glow overlay */}
      {isSelected && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'rgba(245,158,11,.06)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default PlayerCard;