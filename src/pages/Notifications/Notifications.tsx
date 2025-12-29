import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatTimestamp } from '@/utils/format';
import { Card } from '@/components';
import styles from './Notifications.module.scss';

export const Notifications: React.FC = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: api.getNotifications,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return <Card>Loading notifications...</Card>;
  }

  return (
    <div className={styles.notifications}>
      <div className={styles.notifications__header}>
        <h1 className={styles.notifications__title}>Notifications</h1>
        <div className={styles.notifications__filters}>
          <button className={`${styles.notifications__filter} ${styles.notifications__filter_active}`}>All</button>
          <button className={styles.notifications__filter}>Swap</button>
          <button className={styles.notifications__filter}>Transfer</button>
          <button className={styles.notifications__filter}>Airdrop</button>
        </div>
      </div>

      <div className={styles.notifications__list}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={styles.notifications__item}
            >
              <div className={styles.notifications__icon}>
                {notification.category === 'Swap' && '🔄'}
                {notification.category === 'Transfer' && '📤'}
                {notification.category === 'Airdrop' && '🎁'}
                {notification.category === 'Staking' && '💰'}
                {!['Swap', 'Transfer', 'Airdrop', 'Staking'].includes(notification.category) && '🔔'}
              </div>
              <div className={styles.notifications__content}>
                <div className={styles.notifications__contentHeader}>
                  <div className={styles.notifications__titleText}>
                    {notification.title}
                  </div>
                  <div className={styles.notifications__time}>
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>
                <div className={styles.notifications__description}>
                  {notification.description}
                </div>
                <div className={styles.notifications__category}>
                  {notification.category}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.notifications__empty}>No notifications</div>
        )}
      </div>
    </div>
  );
};

