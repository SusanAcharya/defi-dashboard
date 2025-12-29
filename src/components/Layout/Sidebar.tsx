import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import settingsIcon from '@/assets/icons/settings.png';
import walletIcon from '@/assets/icons/wallet.png';
import notificationIcon from '@/assets/icons/notification.png';
import checkinIcon from '@/assets/checkin.png';
import checkedinIcon from '@/assets/checkedin.png';
import styles from './Sidebar.module.scss';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', iconImage: null },
  { path: '/explore', label: 'Explore', icon: '🔍', iconImage: null },
  { path: '/live-chart', label: 'Live Chart', icon: '📈', iconImage: null },
  { path: '/history', label: 'History', icon: '📜', iconImage: null },
  { path: '/notifications', label: 'Notifications', icon: null, iconImage: notificationIcon },
  { path: '/portfolio', label: 'Portfolio', icon: '💼', iconImage: null },
  { path: '/profile', label: 'Profile', icon: '👤', iconImage: null },
];

const topNavItems = [
  { path: '/wallet', label: 'Wallet', icon: null, iconImage: walletIcon },
  { path: '/settings', label: 'Settings', icon: null, iconImage: settingsIcon },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { desktopSidebarOpen, mobileNavOpen, setMobileNavOpen, checkedInToday, lastCheckIn, checkIn, streak } = useUIStore();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculate time remaining until next check-in
  useEffect(() => {
    if (checkedInToday && lastCheckIn) {
      const updateTimeRemaining = () => {
        const now = Date.now();
        const nextCheckInTime = lastCheckIn + (24 * 60 * 60 * 1000);
        const remaining = nextCheckInTime - now;

        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          
          setTimeRemaining(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        } else {
          setTimeRemaining('00:00:00');
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining('');
    }
  }, [checkedInToday, lastCheckIn]);

  const handleCheckIn = () => {
    if (!checkedInToday) {
      checkIn();
    }
  };

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

        {/* Daily Check-in Section */}
        <div className={styles.sidebar__checkIn}>
          {!checkedInToday ? (
            <button
              className={styles.sidebar__checkInButton}
              onClick={handleCheckIn}
            >
              <img 
                src={checkinIcon} 
                alt="Check-in"
                className={styles.sidebar__checkInIcon}
              />
              <span className={styles.sidebar__checkInLabel}>Daily Check-in</span>
            </button>
          ) : (
            <div className={styles.sidebar__checkInStatus}>
              <div className={styles.sidebar__checkInStatusTop}>
                <img 
                  src={checkedinIcon} 
                  alt="Checked in"
                  className={styles.sidebar__checkInStatusIcon}
                />
                <span className={styles.sidebar__checkInStatusLabel}>Checked In</span>
                {streak > 0 && (
                  <span className={styles.sidebar__checkInStreak}>🔥 {streak}</span>
                )}
              </div>
              {timeRemaining && (
                <div className={styles.sidebar__checkInTimer}>
                  Next check-in: {timeRemaining}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

