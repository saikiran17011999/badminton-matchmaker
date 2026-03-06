const SwapIndicator = ({ selectedCount, onSwap, onCancel, canSwap }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-xl px-6 py-3 flex items-center gap-4 z-50 border-2 border-orange-400">
      <span className="text-gray-700">
        {selectedCount === 1 ? 'Select another player to swap' : 'Ready to swap!'}
      </span>
      <div className="flex gap-2">
        {canSwap && (
          <button
            onClick={onSwap}
            className="btn-secondary text-sm py-1 px-4"
          >
            Swap Players
          </button>
        )}
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SwapIndicator;
