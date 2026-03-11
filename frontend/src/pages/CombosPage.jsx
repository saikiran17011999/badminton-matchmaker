import { useNavigate } from 'react-router-dom';

const CombosPage = () => {
  const navigate = useNavigate();

  const comboTypes = [
    {
      id: 'warmup',
      title: 'Warmup',
      description: 'Pre-game stretching and exercises',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'var(--orange)',
    },
    {
      id: 'singles',
      title: 'Singles',
      description: 'Shot combinations for singles play',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'var(--primary)',
    },
    {
      id: 'doubles',
      title: 'Doubles',
      description: 'Team strategies and rotations',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'var(--green)',
    },
  ];

  const handleComboClick = (comboId) => {
    // Placeholder for future navigation
    console.log(`Selected combo: ${comboId}`);
    // navigate(`/combos/${comboId}`);
  };

  return (
    <div className="combos-page">
      {/* Header */}
      <header className="combos-header">
        <button onClick={() => navigate(-1)} className="combos-back-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="combos-title">Combos</h1>
        <div className="w-10" />
      </header>

      <div className="combos-content">
        <p className="combos-subtitle">Select a training category</p>

        <div className="combos-grid">
          {comboTypes.map((combo) => (
            <button
              key={combo.id}
              onClick={() => handleComboClick(combo.id)}
              className="combo-card"
              style={{ '--combo-color': combo.color }}
            >
              <div className="combo-icon">
                {combo.icon}
              </div>
              <h3 className="combo-title">{combo.title}</h3>
              <p className="combo-description">{combo.description}</p>
              <div className="combo-arrow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <p className="combos-coming-soon">
          More features coming soon...
        </p>
      </div>
    </div>
  );
};

export default CombosPage;
