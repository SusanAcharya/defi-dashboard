import React from 'react';
import { useNavigate } from 'react-router-dom';
import swapIcon from '@/assets/icons/swap.png';
import sendIcon from '@/assets/icons/send.png';
import stakeIcon from '@/assets/icons/stake.png';
import airdropIcon from '@/assets/icons/airdrop.png';
import leaderboardIcon from '@/assets/icons/leaderboard.png';
import styles from './QuickActions.module.scss';

const actions = [
  { path: '/swap', label: 'Swap', icon: null, iconImage: swapIcon },
  { path: '/send', label: 'Send', icon: null, iconImage: sendIcon },
  { path: '/staking', label: 'Stake', icon: null, iconImage: stakeIcon },
  { path: '/airdrops', label: 'Airdrops', icon: null, iconImage: airdropIcon },
  { path: '/leaderboard', label: 'Leaderboard', icon: null, iconImage: leaderboardIcon },
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
  );
};

