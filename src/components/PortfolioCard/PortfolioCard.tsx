import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '../Card/Card';
import profileImage from '@/assets/profile.png';
import showIcon from '@/assets/icons/show.png';
import hideIcon from '@/assets/icons/hide.png';
import styles from './PortfolioCard.module.scss';

export const PortfolioCard: React.FC = () => {
  const { selectedWalletAddress, isGuest, username, alias } = useWalletStore();
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio', selectedWalletAddress],
    queryFn: ({ queryKey }) => api.getPortfolio(queryKey[1] as string | null),
    enabled: !isGuest, // Don't fetch if guest
  });

  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const toggleFinancialNumbers = useUIStore((state) => state.toggleFinancialNumbers);

  // Guest mode: return zero portfolio
  const guestPortfolio = {
    totalValue: 0,
    pnl24h: 0,
    totalAssets: 0,
    totalDebt: 0,
    nftValue: 0,
    protocolRewards: 0,
    pnl24hPercent: 0,
  };

  const displayPortfolio = isGuest ? guestPortfolio : portfolio;

  if (isLoading && !isGuest) {
    return <Card className={styles.portfolioCard}>Loading...</Card>;
  }

  if (!displayPortfolio) return null;

  return (
    <Card className={styles.portfolioCard}>
      <div className={styles.portfolioCard__topRow}>
        {alias && <div className={styles.portfolioCard__alias}>Alias: {alias}</div>}
      </div>
      
      {/* Desktop Layout: Top Section with Net Worth and Protocol Rewards */}
      <div className={styles.portfolioCard__topSection}>
        <div className={styles.portfolioCard__topLeft}>
          <div className={styles.portfolioCard__networthHeader}>
            <div className={styles.portfolioCard__label}>TOTAL NET WORTH</div>
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
          <div className={styles.portfolioCard__networthValue}>
            {formatCurrency(displayPortfolio.totalValue, 'USD', showFinancialNumbers)}
          </div>
          <div className={styles.portfolioCard__profitLoss}>
            <div className={styles.portfolioCard__profitLossLabel}>PROFIT/LOSS (24H)</div>
            <div className={`${styles.portfolioCard__profitLossValue} ${
              displayPortfolio.pnl24hPercent >= 0 ? styles.portfolioCard__profitLossValue_positive : styles.portfolioCard__profitLossValue_negative
            }`}>
              {showFinancialNumbers 
                ? formatPercentage(displayPortfolio.pnl24hPercent, 2, showFinancialNumbers)
                : '••••'
              }
            </div>
          </div>
        </div>
        <div className={styles.portfolioCard__topRight}>
          <div className={styles.portfolioCard__coin}>🪙</div>
        </div>
      </div>

      {/* Mobile Layout: Keep original profile and net worth */}
      <div className={styles.portfolioCard__header}>
        <div className={styles.portfolioCard__profile}>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={styles.portfolioCard__avatar}
            style={isGuest ? { opacity: 0.6, filter: 'grayscale(0.3)' } : {}}
          />
          <div className={styles.portfolioCard__info}>
            <div className={styles.portfolioCard__usernameRow}>
              <div className={styles.portfolioCard__username}>{username}</div>
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
            {alias && (
              <div className={styles.portfolioCard__aliasDesktopRow}>
                <div className={styles.portfolioCard__aliasDesktop}>Alias: {alias}</div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.portfolioCard__networth}>
          <div className={styles.portfolioCard__label}>NET WORTH</div>
          <div className={styles.portfolioCard__networthRow}>
            <div className={styles.portfolioCard__value}>
              {formatCurrency(displayPortfolio.totalValue, 'USD', showFinancialNumbers)}
            </div>
            <div className={styles.portfolioCard__change}>
              {showFinancialNumbers 
                ? (displayPortfolio.pnl24h >= 0 ? '+' : '') + formatCurrency(Math.abs(displayPortfolio.pnl24h), 'USD', showFinancialNumbers)
                : '••••'
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.portfolioCard__divider} />
      <div className={styles.portfolioCard__metrics}>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>TOTAL ASSETS</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(displayPortfolio.totalAssets, 'USD', showFinancialNumbers)}
          </div>
        </div>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>TOTAL DEBT</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(displayPortfolio.totalDebt, 'USD', showFinancialNumbers)}
          </div>
        </div>
        <div className={styles.portfolioCard__metric}>
          <div className={styles.portfolioCard__metricLabel}>PROTOCOL REWARDS</div>
          <div className={styles.portfolioCard__metricValue}>
            {formatCurrency(displayPortfolio.protocolRewards, 'USD', showFinancialNumbers)}
          </div>
        </div>
      </div>
    </Card>
  );
};

