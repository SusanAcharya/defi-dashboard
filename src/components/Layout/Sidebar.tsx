import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import styles from './Sidebar.module.scss';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/portfolio', label: 'Portfolio', icon: '💼' },
  { path: '/defi', label: 'DeFi', icon: '🏦' },
  { path: '/swap', label: 'Swap', icon: '🔄' },
  { path: '/send', label: 'Send', icon: '📤' },
  { path: '/address-book', label: 'Address Book', icon: '📇' },
  { path: '/transfers', label: 'Transfers', icon: '📋' },
  { path: '/airdrops', label: 'Airdrops', icon: '🎁' },
  { path: '/staking', label: 'Staking', icon: '💰' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/nfts', label: 'NFTs', icon: '🖼️' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
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
            <span className={styles.sidebar__icon}>{item.icon}</span>
            <span className={styles.sidebar__label}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

