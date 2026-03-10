import { useState } from 'react';
import PlayerCard from './PlayerCard';

const PlayerPanel = ({ players, onAddPlayer, onUpdatePlayer, onRemovePlayer, loading, isOverlay = false }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState('');

  /* ── Logic unchanged ── */
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
    if (editName.trim()) onUpdatePlayer(playerId, editName.trim());
    setEditingPlayer(null);
    setEditName('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') action();
  };

  return (
    <div className="player-panel">

      {/* Title - hidden when in overlay mode (shown in overlay header instead) */}
      {!isOverlay && (
        <h3 className="panel-title">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Players
          <span className="panel-count">{players.length}</span>
        </h3>
      )}

      {/* Player count badge in overlay mode */}
      {isOverlay && (
        <div className="flex justify-end mb-2">
          <span className="panel-count">{players.length} players</span>
        </div>
      )}

      {/* Add player row */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleAddPlayer)}
          placeholder="Player name…"
          className="panel-input"
          disabled={loading}
        />
        <button
          onClick={handleAddPlayer}
          disabled={loading || !newPlayerName.trim()}
          className="btn-primary"
          style={{ padding: '.5rem .9rem', fontSize: '.8rem', minWidth: 0 }}
        >
          Add
        </button>
      </div>

      {/* Divider */}
      <hr className="section-divider mb-3" />

      {/* Player list */}
      <div className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-1.5"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '9px',
              padding: '.35rem .5rem',
              transition: 'border-color .2s',
            }}
          >
            {editingPlayer === player.id ? (
              /* ── Edit mode ── */
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, () => handleSaveEdit(player.id))}
                  className="panel-input flex-1"
                  style={{ padding: '.3rem .6rem', fontSize: '.82rem' }}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(player.id)}
                  className="icon-btn icon-btn-save"
                  aria-label="Save"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setEditingPlayer(null)}
                  className="icon-btn icon-btn-cancel"
                  aria-label="Cancel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              /* ── View mode ── */
              <>
                <div className="flex-1 min-w-0">
                  <PlayerCard player={player} size="small" />
                </div>
                <button
                  onClick={() => handleStartEdit(player)}
                  className="icon-btn icon-btn-edit"
                  aria-label="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="icon-btn icon-btn-del"
                  aria-label="Remove"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}

        {players.length === 0 && (
          <div className="panel-empty">
            <p>No players yet.</p>
            <p style={{ fontSize: '.78rem', marginTop: '.3rem' }}>Add names above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerPanel;