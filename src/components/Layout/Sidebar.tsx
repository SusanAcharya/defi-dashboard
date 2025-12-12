import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import swapIcon from '@/assets/icons/swap.png';
import sendIcon from '@/assets/icons/send.png';
import airdropIcon from '@/assets/icons/airdrop.png';
import stakeIcon from '@/assets/icons/stake.png';
import leaderboardIcon from '@/assets/icons/leaderboard.png';
import settingsIcon from '@/assets/icons/settings.png';
import defiIcon from '@/assets/icons/defi.png';
import notificationIcon from '@/assets/icons/notification.png';
import nftsIcon from '@/assets/icons/nfts.png';
import styles from './Sidebar.module.scss';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', iconImage: null },
  { path: '/notifications', label: 'Notifications', icon: null, iconImage: notificationIcon },
  { path: '/portfolio', label: 'Portfolio', icon: '💼', iconImage: null },
  { path: '/defi', label: 'DeFi', icon: null, iconImage: defiIcon },
  { path: '/swap', label: 'Swap', icon: null, iconImage: swapIcon },
  { path: '/send', label: 'Send', icon: null, iconImage: sendIcon },
  { path: '/address-book', label: 'Address Book', icon: '📇', iconImage: null },
  { path: '/transfers', label: 'Transfers', icon: '📋', iconImage: null },
  { path: '/airdrops', label: 'Airdrops', icon: null, iconImage: airdropIcon },
  { path: '/staking', label: 'Staking', icon: null, iconImage: stakeIcon },
  { path: '/leaderboard', label: 'Leaderboard', icon: null, iconImage: leaderboardIcon },
  { path: '/nfts', label: 'NFTs', icon: null, iconImage: nftsIcon },
  { path: '/settings', label: 'Settings', icon: null, iconImage: settingsIcon },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { desktopSidebarOpen } = useUIStore();

  return (
    <aside className={`${styles.sidebar} ${desktopSidebarOpen ? styles.sidebar_open : ''}`}>
      <nav className={styles.sidebar__nav}>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`${styles.sidebar__item} ${
              location.pathname === item.path ? styles.sidebar__item_active : ''
            }`}
            onClick={() => navigate(item.path)}
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
  );
};

