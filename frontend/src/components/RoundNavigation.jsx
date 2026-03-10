const RoundNavigation = ({ currentRound, totalRounds, onPrevious, onNext, onGenerate, loading }) => {
  const isFirst = currentRound <= 1;
  const isLast  = currentRound >= totalRounds;

  return (
    <div className="round-nav">

      {/* ← Previous */}
      <button
        onClick={onPrevious}
        disabled={isFirst || loading}
        className="nav-btn"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {/* Round counter */}
      <div className="text-center" style={{ lineHeight: 1 }}>
        <p className="round-label">Round</p>
        <p>
          <span className="round-number">{currentRound}</span>
          <span className="round-total"> / {totalRounds}</span>
        </p>
      </div>

      {/* Next / Generate */}
      {isLast ? (
        <button
          onClick={onGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
          style={{ padding: '.5rem 1.1rem', fontSize: '.82rem' }}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              Next Round
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={loading}
          className="nav-btn"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RoundNavigation;