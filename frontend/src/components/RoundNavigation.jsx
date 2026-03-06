const RoundNavigation = ({ currentRound, totalRounds, onPrevious, onNext, onGenerate, loading }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4">
      <button
        onClick={onPrevious}
        disabled={currentRound <= 1 || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${currentRound <= 1 || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-500">Round</p>
        <p className="text-2xl font-bold text-green-600">
          {currentRound} <span className="text-gray-400 text-lg">/ {totalRounds}</span>
        </p>
      </div>

      {currentRound >= totalRounds ? (
        <button
          onClick={onGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              Next Round
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RoundNavigation;
