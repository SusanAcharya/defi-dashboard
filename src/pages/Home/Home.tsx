import React from 'react';
import { PortfolioCard, QuickActions, ActivityFeed, AssetAllocation, PortfolioExposure } from '@/components';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <PortfolioCard />
      <QuickActions />
      <div className={styles.home__grid}>
        <AssetAllocation />
        <PortfolioExposure />
      </div>
      <ActivityFeed />
    </div>
  );
};

