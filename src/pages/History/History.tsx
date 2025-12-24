import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatAddress, formatTimestamp } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components';
import styles from './History.module.scss';

const timeframes = ['7d', '30d'];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'swap': return '🔄';
    case 'transfer': return '📤';
    case 'contract': return '📋';
    case 'airdrop': return '🎁';
    case 'staking': return '💰';
    case 'lending': return '🏦';
    case 'nft': return '🖼️';
    default: return '📝';
  }
};

export const History: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d'>('7d');
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);

  const { data: history, isLoading } = useQuery({
    queryKey: ['history', selectedTimeframe],
    queryFn: () => api.getHistory(selectedTimeframe),
  });

  const totalGasFee = useMemo(() => {
    if (!history) return { eth: 0, usd: 0 };
    return history.reduce(
      (acc, entry) => ({
        eth: acc.eth + entry.gasFee,
        usd: acc.usd + entry.gasFeeUSD,
      }),
      { eth: 0, usd: 0 }
    );
  }, [history]);

  if (isLoading) {
    return <Card>Loading history...</Card>;
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const handleCopyTxHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
  };

  return (
    <div className={styles.history}>
      <Card title="Transaction History" className={styles.history__header}>
        <div className={styles.history__summary}>
          <div className={styles.history__totalGas}>
            <div className={styles.history__totalGasLabel}>Total Gas Fee</div>
            <div className={styles.history__totalGasValue}>
              {showFinancialNumbers 
                ? `${totalGasFee.eth.toFixed(6)} ETH (${formatCurrency(totalGasFee.usd, 'USD', true)})`
                : '•••• ETH (••••)'
              }
            </div>
          </div>
          <div className={styles.history__timeframes}>
            {timeframes.map((tf) => (
              <button
                key={tf}
                className={`${styles.history__timeframe} ${
                  selectedTimeframe === tf ? styles.history__timeframe_active : ''
                }`}
                onClick={() => setSelectedTimeframe(tf as '7d' | '30d')}
              >
                Past {tf === '7d' ? '7 Days' : 'Month'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className={styles.history__list}>
        {history && history.length > 0 ? (
          <div className={styles.history__items}>
            {history.map((entry) => (
              <div key={entry.id} className={styles.history__item}>
                <div className={styles.history__itemHeader}>
                  <div className={styles.history__activity}>
                    <div className={styles.history__activityIcon}>
                      {getActivityIcon(entry.activityType)}
                    </div>
                    <div className={styles.history__activityInfo}>
                      <div className={styles.history__activityTitle}>{entry.activity}</div>
                      {entry.protocol && (
                        <div className={styles.history__activityProtocol}>{entry.protocol}</div>
                      )}
                    </div>
                  </div>
                  <span className={`${styles.history__status} ${styles[`history__status_${entry.status}`]}`}>
                    {entry.status}
                  </span>
                </div>
                <div className={styles.history__itemDetails}>
                  <div className={styles.history__detail}>
                    <span className={styles.history__detailLabel}>Wallet</span>
                    <button
                      className={styles.history__address}
                      onClick={() => handleCopyAddress(entry.wallet)}
                      title={entry.wallet}
                    >
                      {formatAddress(entry.wallet, 6, 4)}
                    </button>
                  </div>
                  <div className={styles.history__detail}>
                    <span className={styles.history__detailLabel}>Gas Fee</span>
                    <div className={styles.history__gasFee}>
                      <div className={styles.history__gasFeeEth}>
                        {showFinancialNumbers 
                          ? `${entry.gasFee.toFixed(6)} ETH`
                          : '•••• ETH'
                        }
                      </div>
                      <div className={styles.history__gasFeeUSD}>
                        {showFinancialNumbers 
                          ? formatCurrency(entry.gasFeeUSD, 'USD', true)
                          : '••••'
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.history__detail}>
                    <span className={styles.history__detailLabel}>Time</span>
                    <span className={styles.history__time}>{formatTimestamp(entry.timestamp)}</span>
                  </div>
                </div>
                <div className={styles.history__itemActions}>
                  <button
                    className={styles.history__viewButton}
                    onClick={() => handleCopyTxHash(entry.txHash)}
                    title="View on Explorer"
                  >
                    View Transaction
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.history__empty}>No transaction history found</div>
        )}
      </Card>
    </div>
  );
};

