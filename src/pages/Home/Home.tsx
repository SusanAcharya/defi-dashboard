import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioCard, QuickActions, ActivityFeed, AssetAllocation, PortfolioExposure, PriceChart } from '@/components';
import defiIcon from '@/assets/icons/defi.png';
import nftsIcon from '@/assets/icons/nfts.png';
import notificationIcon from '@/assets/icons/notification.png';
import settingsIcon from '@/assets/icons/settings.png';
import styles from './Home.module.scss';

const mobileNavItems = [
  { path: '/defi', label: 'DeFi', icon: null, iconImage: defiIcon },
  { path: '/address-book', label: 'Address Book', icon: '📇', iconImage: null },
  { path: '/transfers', label: 'Transfers', icon: '📋', iconImage: null },
  { path: '/nfts', label: 'NFTs', icon: null, iconImage: nftsIcon },
  { path: '/notifications', label: 'Notifications', icon: null, iconImage: notificationIcon },
  { path: '/settings', label: 'Settings', icon: null, iconImage: settingsIcon },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <PortfolioCard />
      <QuickActions />
      <div className={styles.home__grid}>
        <AssetAllocation />
        <PortfolioExposure />
      </div>
      <PriceChart />
      <div className={styles.home__mobileNav}>
        {mobileNavItems.map((item) => (
          <button
            key={item.path}
            className={styles.home__mobileNavButton}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            {item.iconImage ? (
              <img 
                src={item.iconImage} 
                alt={item.label}
                className={styles.home__mobileNavIconImage}
              />
            ) : (
              <span className={styles.home__mobileNavIcon}>{item.icon}</span>
            )}
            <span className={styles.home__mobileNavLabel}>{item.label}</span>
          </button>
        ))}
      </div>
      <ActivityFeed />
    </div>
  );
};

