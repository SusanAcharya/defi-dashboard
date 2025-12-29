import React from 'react';
import { PriceChart } from '@/components';
import styles from './LiveChart.module.scss';

export const LiveChart: React.FC = () => {
  return (
    <div className={styles.liveChart}>
      <div className={styles.liveChart__content}>
        <PriceChart />
      </div>
      <div className={styles.liveChart__overlay}>
        <div className={styles.liveChart__comingSoon}>Coming Soon</div>
      </div>
    </div>
  );
};

