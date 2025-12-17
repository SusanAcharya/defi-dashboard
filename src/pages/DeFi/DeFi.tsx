import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { Card, Button } from '@/components';
import styles from './DeFi.module.scss';

export const DeFi: React.FC = () => {
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const { data: positions = [], isLoading } = useQuery({
    queryKey: ['defi-positions'],
    queryFn: () => api.getDefiPositions(),
  });

  if (isLoading) {
    return <Card>Loading DeFi positions...</Card>;
  }

  return (
    <div className={styles.defi}>
      <Card title="DeFi Positions">
        <div className={styles.defi__list}>
          {positions?.map((position) => (
            <div key={position.id} className={styles.defi__card}>
              <div className={styles.defi__header}>
                <div className={styles.defi__protocol}>
                  <div className={styles.defi__logo} />
                  <div>
                    <div className={styles.defi__name}>{position.protocol}</div>
                    <div className={styles.defi__type}>{position.type.toUpperCase()}</div>
                  </div>
                </div>
              </div>
              <div className={styles.defi__metrics}>
                <div className={styles.defi__metric}>
                  <div className={styles.defi__metricLabel}>Position Value</div>
                  <div className={styles.defi__metricValue}>
                    {formatCurrency(position.positionValue, 'USD', showFinancialNumbers)}
                  </div>
                </div>
                <div className={styles.defi__metric}>
                  <div className={styles.defi__metricLabel}>APR</div>
                  <div className={styles.defi__metricValue}>
                    {formatPercentage(position.apr, 2, showFinancialNumbers)}
                  </div>
                </div>
                <div className={styles.defi__metric}>
                  <div className={styles.defi__metricLabel}>Claimable Rewards</div>
                  <div className={styles.defi__metricValue}>
                    {formatCurrency(position.claimableRewards, 'USD', showFinancialNumbers)}
                  </div>
                </div>
              </div>
              <div className={styles.defi__actions}>
                <Button variant="outline" size="sm">View Details</Button>
                {position.claimableRewards > 0 && (
                  <Button variant="primary" size="sm">Claim Rewards</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

