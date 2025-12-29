import React, { useState, useMemo, useEffect } from 'react';
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
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);

  const { data: history, isLoading } = useQuery({
    queryKey: ['history', selectedTimeframe],
    queryFn: () => api.getHistory(selectedTimeframe),
  });

  // Filter history by date range
  const filteredHistory = useMemo(() => {
    if (!history) return [];
    if (!dateFrom && !dateTo) return history;

    return history.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null; // Include full day

      if (fromDate && entryDate < fromDate) return false;
      if (toDate && entryDate > toDate) return false;
      return true;
    });
  }, [history, dateFrom, dateTo]);

  const totalGasFee = useMemo(() => {
    if (!filteredHistory) return { eth: 0, usd: 0 };
    return filteredHistory.reduce(
      (acc, entry) => ({
        eth: acc.eth + entry.gasFee,
        usd: acc.usd + entry.gasFeeUSD,
      }),
      { eth: 0, usd: 0 }
    );
  }, [filteredHistory]);

  // Set default date range based on timeframe
  useEffect(() => {
    const now = new Date();
    const days = selectedTimeframe === '7d' ? 7 : 30;
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - days);
    
    setDateFrom(fromDate.toISOString().split('T')[0]);
    setDateTo(now.toISOString().split('T')[0]);
  }, [selectedTimeframe]);

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
          <div className={styles.history__filters}>
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
            <div className={styles.history__dateFilters}>
              <div className={styles.history__dateFilter}>
                <label className={styles.history__dateLabel}>From</label>
                <input
                  type="date"
                  className={styles.history__dateInput}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className={styles.history__dateFilter}>
                <label className={styles.history__dateLabel}>To</label>
                <input
                  type="date"
                  className={styles.history__dateInput}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className={styles.history__list}>
        {filteredHistory && filteredHistory.length > 0 ? (
          <div className={styles.history__items}>
            {filteredHistory.map((entry) => (
              <div key={entry.id} className={styles.history__item}>
                <div className={styles.history__itemContent}>
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
                  <div className={styles.history__itemMeta}>
                    <div className={styles.history__metaItem}>
                      <span className={styles.history__detailLabel}>Wallet</span>
                      <button
                        className={styles.history__address}
                        onClick={() => handleCopyAddress(entry.wallet)}
                        title={entry.wallet}
                      >
                        {formatAddress(entry.wallet, 4, 4)}
                      </button>
                    </div>
                    <div className={styles.history__metaItem}>
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
                    <div className={styles.history__metaItem}>
                      <span className={styles.history__detailLabel}>Time</span>
                      <span className={styles.history__time}>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>
                  <div className={styles.history__itemRight}>
                    <span className={`${styles.history__status} ${styles[`history__status_${entry.status}`]}`}>
                      {entry.status}
                    </span>
                    <button
                      className={styles.history__viewButton}
                      onClick={() => handleCopyTxHash(entry.txHash)}
                      title="View on Explorer"
                    >
                      View
                    </button>
                  </div>
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

