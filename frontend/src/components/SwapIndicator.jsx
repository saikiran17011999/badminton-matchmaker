const SwapIndicator = ({ selectedCount, onSwap, onCancel, canSwap }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="swap-bar">

      {/* Player icons */}
      <div className="swap-icons">
        <span>🏃</span>
        {selectedCount >= 2 && (
          <>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--accent)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>🏃</span>
          </>
        )}
      </div>

      {/* Message */}
      <span className="swap-text">
        {selectedCount === 1 ? 'Select a second player to swap' : 'Ready to swap!'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {canSwap && (
          <button onClick={onSwap} className="btn-secondary" style={{ padding: '.35rem 1rem', fontSize: '.78rem' }}>
            Swap ↕
          </button>
        )}
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-2)',
            fontSize: '.75rem',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
            letterSpacing: '.06em',
            padding: '.3rem .7rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--red)'; e.currentTarget.style.color='var(--red)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-2)'; }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SwapIndicator;