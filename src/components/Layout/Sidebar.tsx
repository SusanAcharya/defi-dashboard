import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import swapIcon from '@/assets/icons/swap.png';
import stakeIcon from '@/assets/icons/stake.png';
import settingsIcon from '@/assets/icons/settings.png';
import walletIcon from '@/assets/icons/wallet.png';
import defiIcon from '@/assets/icons/defi.png';
import notificationIcon from '@/assets/icons/notification.png';
import leaderboardIcon from '@/assets/icons/leaderboard.png';
import styles from './Sidebar.module.scss';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', iconImage: null },
  { path: '/explore', label: 'Explore', icon: '🔍', iconImage: null },
  { path: '/live-chart', label: 'Live Chart', icon: '📈', iconImage: null },
  { path: '/history', label: 'History', icon: '📜', iconImage: null },
  { path: '/notifications', label: 'Notifications', icon: null, iconImage: notificationIcon },
  { path: '/portfolio', label: 'Portfolio', icon: '💼', iconImage: null },
  { path: '/defi', label: 'DeFi', icon: null, iconImage: defiIcon },
  { path: '/swap', label: 'Swap', icon: null, iconImage: swapIcon },
  { path: '/address-book', label: 'Address Book', icon: '📇', iconImage: null },
  { path: '/staking', label: 'Staking', icon: null, iconImage: stakeIcon },
  { path: '/leaderboard', label: 'Leaderboard', icon: null, iconImage: leaderboardIcon },
  { path: '/profile', label: 'Profile', icon: '👤', iconImage: null },
];

const topNavItems = [
  { path: '/wallet', label: 'Wallet', icon: null, iconImage: walletIcon },
  { path: '/settings', label: 'Settings', icon: null, iconImage: settingsIcon },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { desktopSidebarOpen, mobileNavOpen, setMobileNavOpen } = useUIStore();

  // Close mobile sidebar when navigating
  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileNavOpen(false);
  };

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };

    if (mobileNavOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen, setMobileNavOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileNavOpen && (
        <div 
          className={styles.sidebar__overlay}
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      
      <aside className={`${styles.sidebar} ${desktopSidebarOpen ? styles.sidebar_open : ''} ${mobileNavOpen ? styles.sidebar_mobileOpen : ''}`}>
        <nav className={styles.sidebar__nav}>
          {/* Top Section: Wallet and Settings */}
          <div className={styles.sidebar__topSection}>
            {topNavItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.sidebar__item} ${styles.sidebar__topItem} ${
                  location.pathname === item.path ? styles.sidebar__item_active : ''
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                {item.iconImage ? (
                  <img 
                    src={item.iconImage} 
                    alt={item.label}
                    className={styles.sidebar__iconImage}
                  />
                ) : (
                  <span className={styles.sidebar__icon}>{item.icon}</span>
                )}
                <span className={styles.sidebar__label}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className={styles.sidebar__divider} />

          {/* Main Navigation Items */}
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.sidebar__item} ${
                location.pathname === item.path ? styles.sidebar__item_active : ''
              }`}
              onClick={() => handleNavigate(item.path)}
            >
              {item.iconImage ? (
                <img 
                  src={item.iconImage} 
                  alt={item.label}
                  className={styles.sidebar__iconImage}
                />
              ) : (
                <span className={styles.sidebar__icon}>{item.icon}</span>
              )}
              <span className={styles.sidebar__label}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

