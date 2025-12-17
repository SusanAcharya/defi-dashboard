import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import { Toast } from '@/components';
import defiIcon from '@/assets/icons/defi.png';
import leaderboardIcon from '@/assets/icons/leaderboard.png';
import styles from './QuickActions.module.scss';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { checkedInToday, checkIn, lastCheckIn } = useUIStore();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate time remaining until next check-in
  useEffect(() => {
    if (checkedInToday && lastCheckIn) {
      const updateTimeRemaining = () => {
        const now = Date.now();
        const nextCheckInTime = lastCheckIn + (24 * 60 * 60 * 1000); // 24 hours from last check-in
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
    }
  }, [checkedInToday, lastCheckIn]);

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const handleCheckIn = () => {
    if (!checkedInToday) {
      checkIn();
    } else {
      // Show toast with time remaining
      setToastMessage(`Next Check-in available in ${timeRemaining || 'calculating...'}`);
      setShowToast(true);
    }
  };

  const actions = [
    { 
      path: '/defi', 
      label: 'DeFi', 
      icon: null, 
      iconImage: defiIcon,
      onClick: () => navigate('/defi')
    },
    { 
      path: '/live-chart', 
      label: 'Live Chart', 
      icon: '📈', 
      iconImage: null,
      onClick: () => navigate('/live-chart')
    },
    { 
      path: '/leaderboard', 
      label: 'Leaderboard', 
      icon: null, 
      iconImage: leaderboardIcon,
      onClick: () => navigate('/leaderboard')
    },
    { 
      path: null, 
      label: checkedInToday ? 'Checked-in' : 'Check-in', 
      icon: checkedInToday ? '✓' : '?', 
      iconImage: null,
      onClick: handleCheckIn,
      isCheckIn: true
    },
  ];

  return (
    <>
      <div className={styles.quickActions}>
        {actions.map((action, index) => (
          <button
            key={action.path || `check-in-${index}`}
            className={`${styles.quickActions__item} ${
              action.isCheckIn && checkedInToday ? styles.quickActions__item_checked : ''
            }`}
            onClick={action.onClick}
          >
            {action.iconImage ? (
              <img 
                src={action.iconImage} 
                alt={action.label}
                className={styles.quickActions__iconImage}
              />
            ) : (
              <span className={styles.quickActions__icon}>{action.icon}</span>
            )}
            <span className={styles.quickActions__label}>{action.label}</span>
          </button>
        ))}
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          type="info"
          duration={3000}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

