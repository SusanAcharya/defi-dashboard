import React from 'react';
import { useNavigate } from 'react-router-dom';
import swapIcon from '@/assets/icons/swap.png';
import defiIcon from '@/assets/icons/defi.png';
import styles from './QuickActions.module.scss';

const actions = [
  { path: '/defi', label: 'DeFi', icon: null, iconImage: defiIcon },
  { path: '/live-chart', label: 'Live Chart', icon: '📈', iconImage: null },
  { path: '/address-book', label: 'Address Book', icon: '📇', iconImage: null },
  { path: '/swap', label: 'Swap', icon: null, iconImage: swapIcon },
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

