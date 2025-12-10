import React from 'react';
import { Card } from '../Card/Card';
import styles from './AssetAllocation.module.scss';

interface Asset {
  name: string;
  percentage: number;
  color: string;
}

const assets: Asset[] = [
  { name: 'Asset 1', percentage: 50, color: '#ffffff' },
  { name: 'Asset 2', percentage: 25, color: '#ef4444' },
  { name: 'Asset 3', percentage: 17, color: '#4a9eff' },
  { name: 'Asset 4', percentage: 4, color: '#4ade80' },
  { name: 'Asset 5', percentage: 4, color: '#ffd700' },
];

export const AssetAllocation: React.FC = () => {
  return (
    <Card title="ASSET ALLOCATION" className={styles.assetAllocation}>
      <div className={styles.assetAllocation__list}>
        {assets.map((asset, index) => (
          <div key={index} className={styles.assetAllocation__item}>
            <div className={styles.assetAllocation__info}>
              <span
                className={styles.assetAllocation__name}
                style={{ color: asset.color }}
              >
                {asset.name}
              </span>
              <span className={styles.assetAllocation__percentage}>
                {asset.percentage}%
              </span>
            </div>
            <div className={styles.assetAllocation__bar}>
              <div
                className={styles.assetAllocation__fill}
                style={{
                  width: `${asset.percentage}%`,
                  backgroundColor: '#ef4444',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

