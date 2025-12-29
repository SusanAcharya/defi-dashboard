import React from 'react';
import { PortfolioCard, LatestNotifications, AssetAllocation, PortfolioExposure } from '@/components';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <PortfolioCard />
      <LatestNotifications />
      <div className={styles.home__grid}>
        <AssetAllocation />
        <PortfolioExposure />
      </div>
    </div>
  );
};

