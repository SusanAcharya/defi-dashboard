import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import homeIcon from '@/assets/icons/home.png';
import walletIcon from '@/assets/icons/wallet.png';
import profileImage from '@/assets/profile.png';
import styles from './BottomNav.module.scss';

const mobileNavItems = [
  { path: '/', label: 'Home', icon: null, iconImage: homeIcon },
  { path: '/portfolio', label: 'Overview', icon: '💼', iconImage: null },
  { path: '/wallet', label: 'Wallets', icon: null, iconImage: walletIcon },
  { path: '/history', label: 'Activity', icon: '📜', iconImage: null },
  { path: '/profile', label: 'Profile', icon: null, iconImage: profileImage },
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
          {item.iconImage ? (
            <img 
              src={item.iconImage} 
              alt={item.label}
              className={styles.bottomNav__iconImage}
            />
          ) : (
            <span className={styles.bottomNav__icon}>{item.icon}</span>
          )}
          <span className={styles.bottomNav__label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

