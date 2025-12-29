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
      <Card>
        <div className={styles.notifications__filters}>
          <button className={`${styles.notifications__filter} ${styles.notifications__filter_active}`}>All</button>
          <button className={styles.notifications__filter}>Swap</button>
          <button className={styles.notifications__filter}>Transfer</button>
          <button className={styles.notifications__filter}>Contract</button>
          <button className={styles.notifications__filter}>Airdrop</button>
        </div>

        <div className={styles.notifications__list}>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notifications__item} ${
                  !notification.read ? styles.notifications__item_unread : ''
                }`}
              >
                <div className={styles.notifications__icon}>
                  {notification.category === 'Swap' && '🔄'}
                  {notification.category === 'Transfer' && '📤'}
                  {notification.category === 'Contract' && '📋'}
                  {notification.category === 'Airdrop' && '🎁'}
                  {notification.category === 'Staking' && '💰'}
                  {!['Swap', 'Transfer', 'Contract', 'Airdrop', 'Staking'].includes(notification.category) && '🔔'}
                </div>
                <div className={styles.notifications__content}>
                  <div className={styles.notifications__header}>
                    <div className={styles.notifications__category}>
                      {notification.category}
                    </div>
                    <div className={styles.notifications__time}>
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>
                  <div className={styles.notifications__title}>
                    {notification.title}
                  </div>
                  <div className={styles.notifications__description}>
                    {notification.description}
                  </div>
                </div>
                {!notification.read && (
                  <div className={styles.notifications__unreadDot} />
                )}
              </div>
            ))
          ) : (
            <div className={styles.notifications__empty}>No notifications</div>
          )}
        </div>
      </Card>
    </div>
  );
};

