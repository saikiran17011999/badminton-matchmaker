const PlayerCard = ({ player, onClick, isSelected, showRating = true, size = 'normal' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    normal: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <div
      onClick={() => onClick?.(player.id)}
      className={`
        player-card bg-white rounded-xl shadow-md cursor-pointer
        flex items-center gap-2 ${sizeClasses[size]}
        ${isSelected ? 'ring-2 ring-orange-400 bg-orange-50' : 'hover:bg-gray-50'}
        transition-all duration-200
      `}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
        {player.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">{player.name}</p>
        {showRating && (
          <p className="text-xs text-gray-500">Rating: {player.rating}</p>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
