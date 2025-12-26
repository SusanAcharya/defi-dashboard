import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatDateTime } from '@/utils/format';
import { Card } from '../Card/Card';
import styles from './LatestNotifications.module.scss';

export const LatestNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: api.getNotifications,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  if (isLoading) {
    return null;
  }

  // Get latest 2 notifications
  const latestNotifications = notifications?.slice(0, 2) || [];

  if (latestNotifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'Swap': return '🔄';
      case 'Transfer': return '📤';
      case 'Contract': return '📋';
      case 'Airdrop': return '🎁';
      case 'Staking': return '💰';
      default: return '🖼️';
    }
  };

  return (
    <Card className={styles.latestNotifications}>
      <div className={styles.latestNotifications__header}>
        <div className={styles.latestNotifications__headerLeft}>
          <span className={styles.latestNotifications__bellIcon}>🔔</span>
          <span className={styles.latestNotifications__title}>RECENT NOTIFICATIONS</span>
        </div>
        <button
          className={styles.latestNotifications__viewAllButton}
          onClick={() => navigate('/notifications')}
          aria-label="View all notifications"
        >
          View all
        </button>
      </div>
      <div className={styles.latestNotifications__separator} />
      <div className={styles.latestNotifications__list}>
        {latestNotifications.map((notification) => (
          <div
            key={notification.id}
            className={styles.latestNotifications__item}
            onClick={() => navigate('/notifications')}
          >
            <span className={styles.latestNotifications__dateTime}>
              {formatDateTime(notification.timestamp)}
            </span>
            <div className={styles.latestNotifications__middle}>
              <span className={styles.latestNotifications__who}>who</span>
              <span className={styles.latestNotifications__icon}>
                {getNotificationIcon(notification.category)}
              </span>
            </div>
            <span className={styles.latestNotifications__text}>
              {notification.title}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

