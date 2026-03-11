import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NavDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { id: 'home', labelKey: 'nav.home', icon: 'home', path: null },
    { id: 'timer', labelKey: 'nav.timer', icon: 'timer', path: 'timer' },
    { id: 'feedback', labelKey: 'nav.feedback', icon: 'feedback', path: 'feedback' },
    { id: 'combos', labelKey: 'nav.combos', icon: 'combos', path: 'combos' },
  ];

  const handleNavigation = (item) => {
    if (item.path === null) {
      onClose();
    } else {
      navigate(`/${item.path}`);
      onClose();
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'timer':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'feedback':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'combos':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="nav-drawer-backdrop"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="nav-drawer">
        {/* Header */}
        <div className="nav-drawer-header">
          <span className="nav-drawer-logo">🏸</span>
          <span className="nav-drawer-title">{t('nav.menu')}</span>
          <button className="nav-drawer-close" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="nav-drawer-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className="nav-drawer-item"
            >
              <span className="nav-drawer-icon">{getIcon(item.icon)}</span>
              <span className="nav-drawer-label">{t(item.labelKey)}</span>
              <svg className="w-4 h-4 nav-drawer-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="nav-drawer-footer">
          <p>{t('app.title')}</p>
          <p className="text-xs opacity-60">{t('nav.version')}</p>
        </div>
      </div>
    </>
  );
};

export default NavDrawer;
