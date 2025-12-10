import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.scss';

const mobileNavItems = [
  { path: '/', label: 'Home', icon: '📊' },
  { path: '/portfolio', label: 'Portfolio', icon: '💼' },
  { path: '/swap', label: 'Swap', icon: '🔄' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.bottomNav}>
      {mobileNavItems.map((item) => (
        <button
          key={item.path}
          className={`${styles.bottomNav__item} ${
            location.pathname === item.path ? styles.bottomNav__item_active : ''
          }`}
          onClick={() => navigate(item.path)}
        >
          <span className={styles.bottomNav__icon}>{item.icon}</span>
          <span className={styles.bottomNav__label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

