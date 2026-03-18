/* Deterministic avatar color: cycles through 8 gradients */
const AVATAR_CLASSES = ['av-0','av-1','av-2','av-3','av-4','av-5','av-6','av-7'];

const getAvatarClass = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_CLASSES[Math.abs(hash) % AVATAR_CLASSES.length];
};

const PlayerCard = ({
  player,
  onClick,
  isSelected,
  showMatchCount = true,
  size = 'normal',
  // Drag-and-drop props
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isDragging = false,
  isDropTarget = false,
  isSwapping = false,
}) => {
  const avClass = getAvatarClass(player.name);
  const initial = player.name.charAt(0).toUpperCase();

  /* size variants */
  const isSmall  = size === 'small';
  const isLarge  = size === 'large';

  let chipClass = isSmall
    ? `player-chip ${isSelected ? 'selected' : ''}`
    : `player-chip-normal player-chip ${isSelected ? 'selected' : ''}`;

  // Add drag states
  if (isDragging) chipClass += ' dragging';
  if (isDropTarget) chipClass += ' drop-target';
  if (isSwapping) chipClass += ' swapping';

  const avatarSizeClass = isSmall ? 'player-avatar player-avatar-sm' : isLarge ? 'player-avatar player-avatar-lg' : 'player-avatar';

  return (
    <div
      onClick={() => onClick?.(player.id)}
      className={chipClass}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(player.id)}
      // Drag-and-drop attributes
      draggable={draggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, player) : undefined}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver ? (e) => onDragOver(e, player) : undefined}
      onDragLeave={onDragLeave}
      onDrop={onDrop ? (e) => onDrop(e, player) : undefined}
      // Touch events for mobile
      onTouchStart={onTouchStart ? (e) => onTouchStart(e, player) : undefined}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd ? (e) => onTouchEnd(e, player) : undefined}
    >
      <div className={`${avatarSizeClass} ${avClass}`}>
        {initial}
      </div>

      <div>
        <p className={`player-name ${isSmall ? 'player-name-sm' : ''}`}>
          {player.name}
        </p>
        {showMatchCount && player.actualMatchesPlayed !== undefined && (
          <p className="player-rating">{player.actualMatchesPlayed} match{player.actualMatchesPlayed !== 1 ? 'es' : ''}</p>
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

      {/* Drag indicator */}
      {draggable && !isDragging && (
        <span className="drag-handle" title="Drag to swap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="2"/>
            <circle cx="15" cy="5" r="2"/>
            <circle cx="9" cy="12" r="2"/>
            <circle cx="15" cy="12" r="2"/>
            <circle cx="9" cy="19" r="2"/>
            <circle cx="15" cy="19" r="2"/>
          </svg>
        </span>
      )}
    </div>
  );
};

export default PlayerCard;