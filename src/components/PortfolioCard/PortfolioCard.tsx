import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency } from '@/utils/format';
import { Card } from '../Card/Card';
import profileImage from '@/assets/profile.png';
import styles from './PortfolioCard.module.scss';

export const PortfolioCard: React.FC = () => {
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: api.getPortfolio,
  });

  if (isLoading) {
    return <Card className={styles.portfolioCard}>Loading...</Card>;
  }

  if (!portfolio) return null;

  return (
    <Card className={styles.portfolioCard}>
      <div className={styles.portfolioCard__header}>
        <div className={styles.portfolioCard__profile}>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={styles.portfolioCard__avatar}
          />
          <div className={styles.portfolioCard__info}>
            <div className={styles.portfolioCard__username}>n00dlehead</div>
            <div className={styles.portfolioCard__alias}>Alias: Thug</div>
          </div>
        </div>
        <div className={styles.portfolioCard__networth}>
          <div className={styles.portfolioCard__label}>NET WORTH</div>
          <div className={styles.portfolioCard__value}>
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className={styles.portfolioCard__change}>
            {formatCurrency(portfolio.pnl24h)}
          </div>
        </div>
      </div>
      <div className={styles.portfolioCard__divider} />
      <div className={styles.portfolioCard__metrics}>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>Total Assets</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(portfolio.totalAssets)}
          </div>
        </div>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>Total Debt</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(portfolio.totalDebt)}
          </div>
        </div>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>NFT Value</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(portfolio.nftValue)}
          </div>
        </div>
      </div>
    </Card>
  );
};

