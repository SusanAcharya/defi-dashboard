import React, { useState, useMemo, useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useUIStore } from "@/store/uiStore";
import { Card, Toast } from "@/components";
import { walletAPI, WalletSubscription } from "@/services/wallet.api";
import profileImage from "@/assets/profile.png";
import { formatAddress } from "@/utils/format";
import styles from "./Profile.module.scss";

export const Profile: React.FC = () => {
  const { username, alias, wallets } = useWalletStore();

  const { streak, checkInHistory, referralCode, referredFriends } =
    useUIStore();
  const [showReferrals, setShowReferrals] = useState(false);
  const [subscribedWallets, setSubscribedWallets] = useState<
    WalletSubscription[]
  >([]);
  const [loadingSubscribed, setLoadingSubscribed] = useState(false);
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

  // Load subscribed wallets
  useEffect(() => {
    const loadSubscribedWallets = async () => {
      if (wallets.length === 0) return;

      try {
        setLoadingSubscribed(true);
        // Fetch subscribed wallets for the first wallet in the list
        const mainWallet = wallets[0];
        const subscribedList = await walletAPI.getSubscribedWallets(
          mainWallet.address
        );

        if (subscribedList && subscribedList.length > 0) {
          // Filter out subscribed wallets that are already in the regular wallets list
          const walletAddresses = new Set(
            wallets.map((w) => w.address.toLowerCase())
          );
          const filteredSubscribed = subscribedList.filter(
            (sub) => !walletAddresses.has(sub.walletAddress.toLowerCase())
          );

          // Debug logging
          console.log(
            "Regular wallets:",
            wallets.map((w) => w.address)
          );
          console.log(
            "Subscribed wallets (before filter):",
            subscribedList.map((s) => s.walletAddress)
          );
          console.log(
            "Subscribed wallets (after filter):",
            filteredSubscribed.map((s) => s.walletAddress)
          );
          console.log(
            "Filtered out wallets:",
            subscribedList
              .filter((s) => walletAddresses.has(s.walletAddress.toLowerCase()))
              .map((s) => s.walletAddress)
          );

          setSubscribedWallets(filteredSubscribed);
        }
      } catch (error) {
        console.error("Failed to load subscribed wallets:", error);
        setToastMessage("Failed to load subscribed wallets");
        setShowToast(true);
      } finally {
        setLoadingSubscribed(false);
      }
    };

    loadSubscribedWallets();
  }, [wallets]);

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

      {/* Subscribed Wallets Section */}
      {subscribedWallets.length > 0 && (
        <Card title="Subscribed Wallets" className={styles.profile__subscribed}>
          {loadingSubscribed ? (
            <div className={styles.profile__loadingState}>
              <p>Loading subscribed wallets...</p>
            </div>
          ) : (
            <div className={styles.profile__subscribedList}>
              {subscribedWallets.map((subWallet) => (
                <div
                  key={subWallet.walletAddress}
                  className={styles.profile__walletItem}
                >
                  <div className={styles.profile__walletHeader}>
                    <div
                      className={styles.profile__walletAddress}
                      onClick={() => handleCopyAddress(subWallet.walletAddress)}
                      title="Click to copy"
                    >
                      <span>
                        {formatAddress(subWallet.walletAddress, 8, 8)}
                      </span>
                      <span className={styles.profile__walletCopyIcon}>📋</span>
                    </div>
                  </div>
                  <div className={styles.profile__walletInfo}>
                    <div className={styles.profile__walletName}>
                      <span className={styles.profile__walletLabel}>Name:</span>
                      <span className={styles.profile__walletValue}>
                        {subWallet.name}
                      </span>
                    </div>
                    <div className={styles.profile__walletType}>
                      <span className={styles.profile__walletLabel}>Type:</span>
                      <span className={styles.profile__walletValue}>
                        📡 Subscribed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );

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

      {/* Subscribed Wallets - Merged with all wallets display */}
      {(wallets.length > 0 || subscribedWallets.length > 0) && (
        <Card title="📡 All Wallets" className={styles.profile__allWallets}>
          {loadingSubscribed ? (
            <div className={styles.profile__loadingState}>
              <p>Loading subscribed wallets...</p>
            </div>
          ) : (
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
                      <span className={styles.profile__walletCopyIcon}>📋</span>
                    </div>
                  </div>
                  <div className={styles.profile__walletInfo}>
                    <div className={styles.profile__walletName}>
                      <span className={styles.profile__walletLabel}>Name:</span>
                      <span className={styles.profile__walletValue}>
                        {wallet.name}
                      </span>
                    </div>
                    <div className={styles.profile__walletType}>
                      <span className={styles.profile__walletLabel}>Type:</span>
                      <span className={styles.profile__walletValue}>
                        {wallet.isMine ? "My Wallet" : "Other's Wallet"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {subscribedWallets.map((subWallet) => (
                <div
                  key={subWallet.walletAddress}
                  className={styles.profile__walletItem}
                >
                  <div className={styles.profile__walletHeader}>
                    <div
                      className={styles.profile__walletAddress}
                      onClick={() => handleCopyAddress(subWallet.walletAddress)}
                      title="Click to copy"
                    >
                      <span>
                        {formatAddress(subWallet.walletAddress, 8, 8)}
                      </span>
                      <span className={styles.profile__walletCopyIcon}>📋</span>
                    </div>
                  </div>
                  <div className={styles.profile__walletInfo}>
                    <div className={styles.profile__walletName}>
                      <span className={styles.profile__walletLabel}>Name:</span>
                      <span className={styles.profile__walletValue}>
                        {subWallet.name}
                      </span>
                    </div>
                    <div className={styles.profile__walletType}>
                      <span className={styles.profile__walletLabel}>Type:</span>
                      <span className={styles.profile__walletValue}>
                        📡 Subscribed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
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
