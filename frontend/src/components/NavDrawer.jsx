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
    { id: 'videos', labelKey: 'nav.videos', icon: 'videos', path: 'combos' },
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
      case 'videos':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
