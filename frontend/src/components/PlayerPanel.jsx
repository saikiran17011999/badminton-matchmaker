import { useState } from 'react';
import PlayerCard from './PlayerCard';

const PlayerPanel = ({ players, onAddPlayer, onUpdatePlayer, onRemovePlayer, loading }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleStartEdit = (player) => {
    setEditingPlayer(player.id);
    setEditName(player.name);
  };

  const handleSaveEdit = (playerId) => {
    if (editName.trim()) {
      onUpdatePlayer(playerId, editName.trim());
    }
    setEditingPlayer(null);
    setEditName('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="card p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">👥</span>
        Players ({players.length})
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleAddPlayer)}
          placeholder="Enter player name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />
        <button
          onClick={handleAddPlayer}
          disabled={loading || !newPlayerName.trim()}
          className="btn-primary py-2 px-4"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {players.map(player => (
          <div key={player.id} className="flex items-center gap-2">
            {editingPlayer === player.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, () => handleSaveEdit(player.id))}
                  className="flex-1 px-2 py-1 border rounded"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(player.id)}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setEditingPlayer(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <PlayerCard player={player} size="small" />
                </div>
                <button
                  onClick={() => handleStartEdit(player)}
                  className="text-gray-400 hover:text-blue-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No players added yet.</p>
          <p className="text-sm">Add players to start the event.</p>
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
