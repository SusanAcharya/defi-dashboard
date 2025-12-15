import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioCard, QuickActions, ActivityFeed, AssetAllocation, PortfolioExposure } from '@/components';
import airdropIcon from '@/assets/icons/airdrop.png';
import sendIcon from '@/assets/icons/send.png';
import nftsIcon from '@/assets/icons/nfts.png';
import styles from './Home.module.scss';

const mobileNavItems = [
  { path: '/airdrops', label: 'Airdrops', icon: null, iconImage: airdropIcon },
  { path: '/send', label: 'Send', icon: null, iconImage: sendIcon },
  { path: '/transfers', label: 'Transfers', icon: '📋', iconImage: null },
  { path: '/nfts', label: 'NFTs', icon: null, iconImage: nftsIcon },
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

