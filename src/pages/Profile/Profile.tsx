import React, { useState, useMemo } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useUIStore } from "@/store/uiStore";
import { Card, Toast } from "@/components";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import profileImage from "@/assets/profile.png";
import { formatAddress } from "@/utils/format";
import styles from "./Profile.module.scss";

export const Profile: React.FC = () => {
  const { username, alias, wallets, isGuest } = useWalletStore();
  const { user: telegramUser, isInTelegram } = useTelegramAuth();

  const { streak, checkInHistory, referralCode, referredFriends } =
    useUIStore();
  const [showReferrals, setShowReferrals] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        timestamp,
        checkedIn,
      });
    }
    return days;
  }, [checkInHistory]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage("Wallet address copied to clipboard");
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className={styles.profile}>
      {isGuest ? (
        <Card className={styles.profile__guestMessage}>
          <div className={styles.profile__guestMessageContent}>
            <div className={styles.profile__guestMessageIcon}>👋</div>
            <div className={styles.profile__guestMessageTitle}>
              Welcome to Your Profile
            </div>
            <div className={styles.profile__guestMessageText}>
              Connect a wallet to access your full profile, check-in streak,
              referral program, and more.
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card title="Profile" className={styles.profile__profile}>
            <div className={styles.profile__profileHeader}>
              <img
                src={profileImage}
                alt="Profile"
                className={styles.profile__profileImage}
              />
              <div className={styles.profile__profileInfo}>
                <div className={styles.profile__username}>{username}</div>
                {alias && (
                  <div className={styles.profile__alias}>Alias: {alias}</div>
                )}
                <div className={styles.profile__streak}>
                  🔥 Streak: {streak} days
                </div>
              </div>
            </div>
          </Card>

          {/* Referral System */}
          <Card title="Referral Program" className={styles.profile__referral}>
            <div className={styles.profile__referralCode}>
              <div className={styles.profile__referralLabel}>
                Your Referral Code
              </div>
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
                  {showReferrals ? "−" : "+"}
                </span>
              </button>
              {showReferrals && (
                <div className={styles.profile__referralList}>
                  {referredFriends > 0 ? (
                    <div className={styles.profile__referralItem}>
                      <div className={styles.profile__referralFriend}>
                        Friend 1 -{" "}
                        {formatAddress(
                          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                          4,
                          4
                        )}
                      </div>
                      <div className={styles.profile__referralDate}>
                        Joined 5 days ago
                      </div>
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

          {/* Daily Check-in */}
          <Card title="Daily Check-in" className={styles.profile__checkin}>
            <div className={styles.profile__checkinStreak}>
              <div className={styles.profile__checkinStreakLabel}>
                Current Streak
              </div>
              <div className={styles.profile__checkinStreakValue}>
                {streak} days 🔥
              </div>
            </div>
            <div className={styles.profile__checkinCalendar}>
              <div className={styles.profile__checkinCalendarTitle}>
                Last 30 Days
              </div>
              <div className={styles.profile__checkinCalendarGrid}>
                {checkInCalendar.map((day, index) => (
                  <div
                    key={index}
                    className={`${styles.profile__checkinDay} ${
                      day.checkedIn
                        ? styles.profile__checkinDay_checked
                        : styles.profile__checkinDay_missed
                    }`}
                    title={day.date}
                  >
                    {day.checkedIn ? "✓" : "✕"}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Telegram Account Section */}
          {isInTelegram && telegramUser && (
            <Card title="Telegram Account" className={styles.profile__telegram}>
              <div className={styles.profile__telegramInfo}>
                <div className={styles.profile__telegramBadge}>📱 Telegram</div>
                <div className={styles.profile__telegramUser}>
                  <div className={styles.profile__telegramName}>
                    {telegramUser.first_name}
                    {telegramUser.last_name ? ` ${telegramUser.last_name}` : ""}
                  </div>
                  {telegramUser.username && (
                    <div className={styles.profile__telegramUsername}>
                      @{telegramUser.username}
                    </div>
                  )}
                  <div className={styles.profile__telegramId}>
                    ID: {telegramUser.id}
                  </div>
                  {telegramUser.is_premium && (
                    <div className={styles.profile__telegramPremium}>
                      ⭐ Premium Member
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Subscribed Wallets - Merged with all wallets display */}
          {wallets.length > 0 && (
            <Card title="📡 All Wallets" className={styles.profile__allWallets}>
              <div className={styles.profile__walletsList}>
                {wallets.map((wallet) => (
                  <div
                    key={wallet.address}
                    className={styles.profile__walletItem}
                  >
                    <div className={styles.profile__walletHeader}>
                      <div
                        className={styles.profile__walletAddress}
                        onClick={() => handleCopyAddress(wallet.address)}
                        title="Click to copy"
                      >
                        <span>{formatAddress(wallet.address, 8, 8)}</span>
                        <span className={styles.profile__walletCopyIcon}>
                          📋
                        </span>
                      </div>
                    </div>
                    <div className={styles.profile__walletInfo}>
                      <div className={styles.profile__walletName}>
                        <span className={styles.profile__walletLabel}>
                          Name:
                        </span>
                        <span className={styles.profile__walletValue}>
                          {wallet.name}
                        </span>
                      </div>
                      <div className={styles.profile__walletType}>
                        <span className={styles.profile__walletLabel}>
                          Type:
                        </span>
                        <span className={styles.profile__walletValue}>
                          {wallet.isMine ? "My Wallet" : "Other's Wallet"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          duration={3000}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};
