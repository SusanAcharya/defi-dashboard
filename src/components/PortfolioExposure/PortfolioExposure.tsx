import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '../Card/Card';
import styles from './PortfolioExposure.module.scss';

export const PortfolioExposure: React.FC = () => {
  const { selectedWalletAddress } = useWalletStore();
  
  // Get DeFi positions for selected wallet or combined
  const { data: defiPositions } = useQuery({
    queryKey: ['defiPositions', selectedWalletAddress],
    queryFn: ({ queryKey }) => api.getDefiPositions(queryKey[1] as string | null),
  });

  // Convert DeFi positions to exposure data
  const data = defiPositions?.map((pos, index) => {
    const colors = ['#8b5cf6', '#6366f1', '#a855f7', '#7c3aed', '#10b981', '#ef4444'];
    return {
      name: pos.protocol,
      value: pos.positionValue,
      color: colors[index % colors.length],
    };
  }) || [
    { name: 'JediSwap', value: 7500, color: '#8b5cf6' },
    { name: '10KSwap', value: 7500, color: '#6366f1' },
    { name: 'Ekubo', value: 580, color: '#a855f7' },
    { name: 'zkLend', value: 7500, color: '#7c3aed' },
    { name: 'STRK Staking', value: 20, color: '#10b981' },
  ];

  // Only show first 5 items
  const displayData = data.slice(0, 5);
  const totalValue = displayData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card title="PROTOCOL EXPOSURE (Risk Distribution)" className={styles.portfolioExposure}>
      <div className={styles.portfolioExposure__header}>
        <span className={styles.portfolioExposure__trend}>+18.5% (30D)</span>
      </div>
      <div className={styles.portfolioExposure__list}>
        {displayData.map((item, index) => {
          const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          return (
            <div key={index} className={styles.portfolioExposure__item}>
              <div className={styles.portfolioExposure__itemIcon}>
                {item.name[0]}
              </div>
              <div className={styles.portfolioExposure__itemInfo}>
                <div className={styles.portfolioExposure__itemName}>{item.name}</div>
                <div className={styles.portfolioExposure__itemValue}>
                  ${item.value.toLocaleString()}
                </div>
              </div>
              <div className={styles.portfolioExposure__itemAllocation}>
                <div className={styles.portfolioExposure__itemBar}>
                  <div 
                    className={styles.portfolioExposure__itemBarFill}
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className={styles.portfolioExposure__itemPercentage}>
                  {percentage < 0.01 ? '<0.01%' : `${percentage.toFixed(2)}%`}
                </div>
              </div>
              <button className={styles.portfolioExposure__itemMenu}>⋮</button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

