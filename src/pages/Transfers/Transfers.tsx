import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatTimestamp, formatAddress } from '@/utils/format';
import { Card } from '@/components';
import styles from './Transfers.module.scss';

export const Transfers: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const { data: transfers, isLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: api.getTransfers,
  });

  const filteredTransfers = transfers?.filter((transfer) => {
    if (filter === 'all') return true;
    return transfer.type === filter;
  });

  if (isLoading) {
    return <Card>Loading transfers...</Card>;
  }

  return (
    <div className={styles.transfers}>
      <Card>
        <div className={styles.transfers__header}>
          <h2>Transfer History</h2>
          <div className={styles.transfers__filters}>
            <button
              className={`${styles.transfers__filter} ${
                filter === 'all' ? styles.transfers__filter_active : ''
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.transfers__filter} ${
                filter === 'incoming' ? styles.transfers__filter_active : ''
              }`}
              onClick={() => setFilter('incoming')}
            >
              Incoming
            </button>
            <button
              className={`${styles.transfers__filter} ${
                filter === 'outgoing' ? styles.transfers__filter_active : ''
              }`}
              onClick={() => setFilter('outgoing')}
            >
              Outgoing
            </button>
          </div>
        </div>

        <div className={styles.transfers__list}>
          {filteredTransfers?.map((transfer) => (
            <div key={transfer.id} className={styles.transfers__item}>
              <div className={styles.transfers__icon}>
                {transfer.type === 'incoming' ? '⬇️' : '⬆️'}
              </div>
              <div className={styles.transfers__content}>
                <div className={styles.transfers__token}>{transfer.token}</div>
                <div className={styles.transfers__amount}>
                  {transfer.type === 'incoming' ? '+' : '-'}
                  {transfer.amount} {transfer.token}
                </div>
                <div className={styles.transfers__address}>
                  {transfer.type === 'incoming' ? 'From' : 'To'}:{' '}
                  {formatAddress(transfer.type === 'incoming' ? transfer.from : transfer.to)}
                </div>
              </div>
              <div className={styles.transfers__meta}>
                <div
                  className={`${styles.transfers__status} ${
                    styles[`transfers__status_${transfer.status}`]
                  }`}
                >
                  {transfer.status}
                </div>
                <div className={styles.transfers__time}>
                  {formatTimestamp(transfer.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

