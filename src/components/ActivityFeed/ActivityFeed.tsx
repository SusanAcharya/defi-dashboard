import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatTimestamp } from '@/utils/format';
import { Card } from '../Card/Card';
import styles from './ActivityFeed.module.scss';

export const ActivityFeed: React.FC = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: api.getActivities,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return <Card title="Live Activity Feed">Loading...</Card>;
  }

  if (!activities || activities.length === 0) {
    return <Card title="Live Activity Feed">No activities yet</Card>;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return '🔄';
      case 'transfer':
        return '📤';
      case 'contract':
        return '📄';
      case 'airdrop':
        return '🎁';
      default:
        return '📊';
    }
  };

  return (
    <Card title="Live Activity Feed" className={styles.activityFeed}>
      <div className={styles.activityFeed__list}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityFeed__item}>
            <div className={styles.activityFeed__icon}>
              {getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityFeed__content}>
              <div className={styles.activityFeed__title}>{activity.title}</div>
              <div className={styles.activityFeed__description}>
                {activity.description}
              </div>
            </div>
            <div className={styles.activityFeed__time}>
              {formatTimestamp(activity.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

