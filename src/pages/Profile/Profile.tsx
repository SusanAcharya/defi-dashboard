import React, { useState, useMemo } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components';
import profileImage from '@/assets/profile.png';
import { formatAddress } from '@/utils/format';
import styles from './Profile.module.scss';

export const Profile: React.FC = () => {
  const { 
    username,
    alias,
    isGuest,
    loginWithTelegram,
    logout,
  } = useWalletStore();
  
  const { streak, checkInHistory, referralCode, referredFriends } = useUIStore();
  const [showReferrals, setShowReferrals] = useState(false);

  // Calculate check-in calendar (last 30 days)
  const checkInCalendar = useMemo(() => {
    const days = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      date.setHours(0, 0, 0, 0);
      const timestamp = date.getTime();
      const checkedIn = checkInHistory.includes(timestamp);
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp,
        checkedIn,
      });
    }
    return days;
  }, [checkInHistory]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
  };

  return (
    <div className={styles.profile}>
      {/* Profile Section */}
      <Card title="Profile" className={styles.profile__profile}>
        <div className={styles.profile__profileHeader}>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={styles.profile__profileImage}
          />
          <div className={styles.profile__profileInfo}>
            <div className={styles.profile__username}>{username}</div>
            {!isGuest && alias && (
              <div className={styles.profile__alias}>Alias: {alias}</div>
            )}
            {!isGuest && (
              <div className={styles.profile__streak}>
                🔥 Streak: {streak} days
              </div>
            )}
          </div>
        </div>
        {isGuest ? (
          <div className={styles.profile__guestSection}>
            <button
              className={styles.profile__telegramButton}
              onClick={loginWithTelegram}
            >
              <span className={styles.profile__telegramIcon}>📱</span>
              Login with Telegram
            </button>
          </div>
        ) : (
          <div className={styles.profile__logoutSection}>
            <button
              className={styles.profile__logoutButton}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </Card>

      {/* Referral System - Only show if logged in */}
      {!isGuest && (
        <Card title="Referral Program" className={styles.profile__referral}>
        <div className={styles.profile__referralCode}>
          <div className={styles.profile__referralLabel}>Your Referral Code</div>
          <div className={styles.profile__referralCodeValue}>
            {referralCode}
            <button
              className={styles.profile__copyButton}
              onClick={handleCopyReferralCode}
              title="Copy referral code"
            >
              📋
            </button>
          </div>
        </div>
        <div className={styles.profile__referralStats}>
          <button
            className={styles.profile__referralToggle}
            onClick={() => setShowReferrals(!showReferrals)}
          >
            <span>Referred Friends: {referredFriends}</span>
            <span className={styles.profile__referralToggleIcon}>
              {showReferrals ? '−' : '+'}
            </span>
          </button>
          {showReferrals && (
            <div className={styles.profile__referralList}>
              {referredFriends > 0 ? (
                <div className={styles.profile__referralItem}>
                  <div className={styles.profile__referralFriend}>
                    Friend 1 - {formatAddress('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', 4, 4)}
                  </div>
                  <div className={styles.profile__referralDate}>Joined 5 days ago</div>
                </div>
              ) : (
                <div className={styles.profile__noReferrals}>
                  No friends referred yet. Share your code to earn rewards!
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      )}

      {/* Daily Check-in - Only show if logged in */}
      {!isGuest && (
        <Card title="Daily Check-in" className={styles.profile__checkin}>
        <div className={styles.profile__checkinStreak}>
          <div className={styles.profile__checkinStreakLabel}>Current Streak</div>
          <div className={styles.profile__checkinStreakValue}>{streak} days 🔥</div>
        </div>
        <div className={styles.profile__checkinCalendar}>
          <div className={styles.profile__checkinCalendarTitle}>Last 30 Days</div>
          <div className={styles.profile__checkinCalendarGrid}>
            {checkInCalendar.map((day, index) => (
              <div
                key={index}
                className={`${styles.profile__checkinDay} ${
                  day.checkedIn ? styles.profile__checkinDay_checked : styles.profile__checkinDay_missed
                }`}
                title={day.date}
              >
                {day.checkedIn ? '✓' : '✕'}
              </div>
            ))}
          </div>
        </div>
      </Card>
      )}
    </div>
  );
};

