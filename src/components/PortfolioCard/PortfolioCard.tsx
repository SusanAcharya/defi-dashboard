import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '../Card/Card';
import profileImage from '@/assets/profile.png';
import showIcon from '@/assets/icons/show.png';
import hideIcon from '@/assets/icons/hide.png';
import styles from './PortfolioCard.module.scss';

export const PortfolioCard: React.FC = () => {
  const { selectedWalletAddress } = useWalletStore();
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio', selectedWalletAddress],
    queryFn: ({ queryKey }) => api.getPortfolio(queryKey[1] as string | null),
  });

  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const toggleFinancialNumbers = useUIStore((state) => state.toggleFinancialNumbers);

  if (isLoading) {
    return <Card className={styles.portfolioCard}>Loading...</Card>;
  }

  if (!portfolio) return null;

  return (
    <Card className={styles.portfolioCard}>
      <div className={styles.portfolioCard__topRow}>
        <div className={styles.portfolioCard__alias}>Alias: Thug</div>
      </div>
      <div className={styles.portfolioCard__header}>
        <div className={styles.portfolioCard__profile}>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={styles.portfolioCard__avatar}
          />
          <div className={styles.portfolioCard__info}>
            <div className={styles.portfolioCard__usernameRow}>
              <div className={styles.portfolioCard__username}>n00dlehead</div>
              <button
                className={styles.portfolioCard__eyeButton}
                onClick={toggleFinancialNumbers}
                aria-label={showFinancialNumbers ? 'Hide numbers' : 'Show numbers'}
              >
                <img 
                  src={showFinancialNumbers ? showIcon : hideIcon} 
                  alt={showFinancialNumbers ? 'Hide numbers' : 'Show numbers'}
                  className={styles.portfolioCard__eyeIcon}
                />
              </button>
            </div>
            <div className={styles.portfolioCard__aliasDesktopRow}>
              <div className={styles.portfolioCard__aliasDesktop}>Alias: Thug</div>
            </div>
          </div>
        </div>
        <div className={styles.portfolioCard__networth}>
          <div className={styles.portfolioCard__label}>NET WORTH</div>
          <div className={styles.portfolioCard__networthRow}>
            <div className={styles.portfolioCard__value}>
              {formatCurrency(portfolio.totalValue, 'USD', showFinancialNumbers)}
            </div>
            <div className={styles.portfolioCard__change}>
              {showFinancialNumbers 
                ? (portfolio.pnl24h >= 0 ? '+' : '') + formatCurrency(Math.abs(portfolio.pnl24h), 'USD', showFinancialNumbers)
                : '••••'
              }
            </div>
          </div>
        </div>
      </div>
      <div className={styles.portfolioCard__divider} />
      <div className={styles.portfolioCard__metrics}>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>Total Assets</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(portfolio.totalAssets, 'USD', showFinancialNumbers)}
          </div>
        </div>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>Total Debt</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(portfolio.totalDebt, 'USD', showFinancialNumbers)}
          </div>
        </div>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>NFT Value</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(portfolio.nftValue, 'USD', showFinancialNumbers)}
          </div>
        </div>
      </div>
    </Card>
  );
};

