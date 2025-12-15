import React from 'react';
import { PriceChart } from '@/components';
import styles from './LiveChart.module.scss';

export const LiveChart: React.FC = () => {
  return (
    <div className={styles.liveChart}>
      <PriceChart />
    </div>
  );
};

