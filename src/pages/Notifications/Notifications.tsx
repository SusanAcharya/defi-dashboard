import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatTimestamp } from '@/utils/format';
import { Card } from '@/components';
import { useWalletStore } from '@/store/walletStore';
import styles from './Notifications.module.scss';

export const Notifications: React.FC = () => {
  const { settings, updateSettings } = useWalletStore();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: api.getNotifications,
    refetchInterval: 10000,
  });

  const toggleTelegram = () => {
    updateSettings({ telegramAlerts: !settings.telegramAlerts });
  };

  if (isLoading) {
    return <Card>Loading notifications...</Card>;
  }

  return (
    <div className={styles.notifications}>
      <Card>
        <div className={styles.notifications__header}>
          <h2>Notifications</h2>
          <div className={styles.notifications__telegram}>
            <span>Telegram Alerts</span>
            <button
              className={`${styles.notifications__toggle} ${
                settings.telegramAlerts ? styles.notifications__toggle_active : ''
              }`}
              onClick={toggleTelegram}
            >
              {settings.telegramAlerts ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.notifications__filters}>
          <button className={styles.notifications__filter}>All</button>
          <button className={styles.notifications__filter}>Swap</button>
          <button className={styles.notifications__filter}>Transfer</button>
          <button className={styles.notifications__filter}>Contract</button>
          <button className={styles.notifications__filter}>Airdrop</button>
        </div>

        <div className={styles.notifications__list}>
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notifications__item} ${
                !notification.read ? styles.notifications__item_unread : ''
              }`}
            >
              <div className={styles.notifications__content}>
                <div className={styles.notifications__category}>
                  {notification.category}
                </div>
                <div className={styles.notifications__title}>
                  {notification.title}
                </div>
                <div className={styles.notifications__description}>
                  {notification.description}
                </div>
              </div>
              <div className={styles.notifications__time}>
                {formatTimestamp(notification.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

