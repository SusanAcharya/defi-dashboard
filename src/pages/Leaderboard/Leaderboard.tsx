import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatAddress } from '@/utils/format';
import { Card } from '@/components';
import profileImage from '@/assets/profile.png';
import styles from './Leaderboard.module.scss';

const tabs = ['Global', 'Friends', 'Top 100', 'My Rank'];

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Global');
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', activeTab.toLowerCase()],
    queryFn: () => api.getLeaderboard(activeTab.toLowerCase()),
  });

  if (isLoading) {
    return <Card>Loading leaderboard...</Card>;
  }

  return (
    <div className={styles.leaderboard}>
      <Card>
        <div className={styles.leaderboard__tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.leaderboard__tab} ${
                activeTab === tab ? styles.leaderboard__tab_active : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.leaderboard__list}>
          {leaderboard?.map((entry) => (
            <div key={entry.rank} className={styles.leaderboard__row}>
              <div className={styles.leaderboard__rank}>#{entry.rank}</div>
              <div className={styles.leaderboard__user}>
                <div className={styles.leaderboard__wallet}>
                  {entry.username || formatAddress(entry.wallet)}
                </div>
                {entry.alias && (
                  <div className={styles.leaderboard__alias}>
                    Alias: {entry.alias}
                  </div>
                )}
              </div>
              <div className={styles.leaderboard__emeralds}>
                <span className={styles.leaderboard__emeraldIcon}>💎</span>
                <span className={styles.leaderboard__emeraldCount}>
                  {entry.emeralds.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Player Profile">
        <div className={styles.leaderboard__profile}>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={styles.leaderboard__profileAvatar}
          />
          <div className={styles.leaderboard__profileInfo}>
            <div className={styles.leaderboard__profileName}>n00dlehead</div>
            <div className={styles.leaderboard__profileAlias}>Alias: Thug</div>
            <div className={styles.leaderboard__profileRank}>
              Rank: #{leaderboard?.[0]?.rank || 'N/A'}
            </div>
            <div className={styles.leaderboard__profileEmeralds}>
              Emeralds: {leaderboard?.[0]?.emeralds.toLocaleString() || 0}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

