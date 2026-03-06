import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';

const EventSetup = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState('doubles');
  const [numCourts, setNumCourts] = useState(2);
  const [playerNames, setPlayerNames] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const names = playerNames
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      const event = await createEvent({
        type: eventType,
        numCourts: parseInt(numCourts),
        playerNames: names
      });

      navigate(`/event/${event.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏸</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Badminton Matchmaker
          </h1>
          <p className="text-gray-600">
            Create fair matches automatically for your badminton event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Event Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setEventType('singles')}
                className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all border-2 ${
                  eventType === 'singles'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🧍</div>
                Singles
              </button>
              <button
                type="button"
                onClick={() => setEventType('doubles')}
                className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all border-2 ${
                  eventType === 'doubles'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">👥</div>
                Doubles
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Number of Courts
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setNumCourts(Math.max(1, numCourts - 1))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
              >
                -
              </button>
              <span className="text-3xl font-bold text-green-600 w-12 text-center">
                {numCourts}
              </span>
              <button
                type="button"
                onClick={() => setNumCourts(numCourts + 1)}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Players (one per line)
            </label>
            <textarea
              value={playerNames}
              onChange={(e) => setPlayerNames(e.target.value)}
              placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana&#10;..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {playerNames.split('\n').filter(n => n.trim()).length} players entered
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-lg py-4"
          >
            {loading ? 'Creating Event...' : 'START EVENT'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          You can always add more players later
        </p>
      </div>
    </div>
  );
};

export default EventSetup;
