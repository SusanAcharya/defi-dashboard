import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuickActions.module.scss';

const actions = [
  { path: '/swap', label: 'Swap', icon: '🔄' },
  { path: '/send', label: 'Send', icon: '📤' },
  { path: '/staking', label: 'Stake', icon: '💰' },
  { path: '/airdrops', label: 'Airdrops', icon: '🎁' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.quickActions}>
      {actions.map((action) => (
        <button
          key={action.path}
          className={styles.quickActions__item}
          onClick={() => navigate(action.path)}
        >
          <span className={styles.quickActions__icon}>{action.icon}</span>
          <span className={styles.quickActions__label}>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

