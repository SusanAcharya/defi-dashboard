import React, { useState } from "react";
import { Modal } from "@/components";
import { useUIStore } from "@/store/uiStore";
import { useWalletStore } from "@/store/walletStore";
import { authAPI } from "@/services/auth.api";
import styles from "./TelegramConnectModal.module.scss";

type ConnectionStep = "start" | "connecting" | "verify" | "success" | "error";

export const TelegramConnectModal: React.FC = () => {
  const { telegramConnectModalOpen, setTelegramConnectModalOpen } =
    useUIStore();
  const { wallets, updateSettings } = useWalletStore();
  const [step, setStep] = useState<ConnectionStep>("start");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  const TELEGRAM_BOT_URL = "https://t.me/test_bahadur_bot";
  const TELEGRAM_BOT_USERNAME = "@test_bahadur_bot";

  const handleClose = () => {
    setTelegramConnectModalOpen(false);
    // Reset state after close animation
    setTimeout(() => {
      setStep("start");
      setTelegramUsername("");
      setVerificationCode("");
      setError("");
    }, 300);
  };

  const handleStartConnection = () => {
    if (!telegramUsername.trim()) {
      setError("Please enter your Telegram username");
      return;
    }
    setError("");
    setStep("connecting");

    // Open Telegram bot in new window
    window.open(TELEGRAM_BOT_URL, "_blank");

    // After a short delay, move to verification step
    setTimeout(() => {
      setStep("verify");
    }, 1500);
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setError("");
    setStep("connecting");

    try {
      // Get the first wallet address if available
      const walletAddress = wallets[0]?.address;

      if (walletAddress) {
        // Call the API to link Telegram
        await authAPI.onboard(walletAddress, telegramUsername.replace("@", ""));
      }

      // Update settings to enable Telegram alerts
      updateSettings({ telegramAlerts: true });

      setStep("success");
    } catch (err) {
      console.error("Failed to connect Telegram:", err);
      setError("Failed to verify. Please try again.");
      setStep("verify");
    }
  };

  const handleOpenBot = () => {
    window.open(TELEGRAM_BOT_URL, "_blank");
  };

  const renderContent = () => {
    switch (step) {
      case "start":
        return (
          <>
            <div className={styles.telegramConnect__icon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <h3 className={styles.telegramConnect__title}>Connect Telegram</h3>
            <p className={styles.telegramConnect__description}>
              Link your Telegram account to receive real-time notifications
              about your wallet activity, airdrops, and more.
            </p>

            <div className={styles.telegramConnect__form}>
              <div className={styles.telegramConnect__inputGroup}>
                <label className={styles.telegramConnect__label}>
                  Telegram Username
                </label>
                <input
                  type="text"
                  className={styles.telegramConnect__input}
                  placeholder="@yourusername"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                />
              </div>

              {error && (
                <div className={styles.telegramConnect__error}>{error}</div>
              )}

              <button
                className={styles.telegramConnect__button}
                onClick={handleStartConnection}
              >
                <span className={styles.telegramConnect__buttonIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </span>
                Connect with Telegram
              </button>
            </div>

            <div className={styles.telegramConnect__features}>
              <div className={styles.telegramConnect__feature}>
                <span className={styles.telegramConnect__featureIcon}>🔔</span>
                <span>Real-time transaction alerts</span>
              </div>
              <div className={styles.telegramConnect__feature}>
                <span className={styles.telegramConnect__featureIcon}>🎁</span>
                <span>Airdrop notifications</span>
              </div>
              <div className={styles.telegramConnect__feature}>
                <span className={styles.telegramConnect__featureIcon}>📊</span>
                <span>Portfolio updates</span>
              </div>
              <div className={styles.telegramConnect__feature}>
                <span className={styles.telegramConnect__featureIcon}>⚡</span>
                <span>Instant DeFi alerts</span>
              </div>
            </div>
          </>
        );

      case "connecting":
        return (
          <div className={styles.telegramConnect__loading}>
            <div className={styles.telegramConnect__spinner}></div>
            <p>Connecting to Telegram...</p>
          </div>
        );

      case "verify":
        return (
          <>
            <div className={styles.telegramConnect__icon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h3 className={styles.telegramConnect__title}>Verify Connection</h3>
            <p className={styles.telegramConnect__description}>
              Open {TELEGRAM_BOT_USERNAME} on Telegram and send{" "}
              <strong>/start</strong> to get your verification code.
            </p>

            <button
              className={styles.telegramConnect__linkButton}
              onClick={handleOpenBot}
            >
              Open {TELEGRAM_BOT_USERNAME} →
            </button>

            <div className={styles.telegramConnect__form}>
              <div className={styles.telegramConnect__inputGroup}>
                <label className={styles.telegramConnect__label}>
                  Verification Code
                </label>
                <input
                  type="text"
                  className={styles.telegramConnect__input}
                  placeholder="Enter code from bot"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>

              {error && (
                <div className={styles.telegramConnect__error}>{error}</div>
              )}

              <button
                className={styles.telegramConnect__button}
                onClick={handleVerify}
              >
                Verify & Connect
              </button>

              <button
                className={styles.telegramConnect__secondaryButton}
                onClick={() => setStep("start")}
              >
                ← Back
              </button>
            </div>
          </>
        );

      case "success":
        return (
          <div className={styles.telegramConnect__success}>
            <div className={styles.telegramConnect__successIcon}>✓</div>
            <h3 className={styles.telegramConnect__title}>Connected!</h3>
            <p className={styles.telegramConnect__description}>
              Your Telegram account has been successfully linked. You'll now
              receive notifications via Telegram.
            </p>
            <button
              className={styles.telegramConnect__button}
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        );

      case "error":
        return (
          <div className={styles.telegramConnect__error}>
            <div className={styles.telegramConnect__errorIcon}>✕</div>
            <h3 className={styles.telegramConnect__title}>Connection Failed</h3>
            <p className={styles.telegramConnect__description}>
              {error || "Something went wrong. Please try again."}
            </p>
            <button
              className={styles.telegramConnect__button}
              onClick={() => setStep("start")}
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={telegramConnectModalOpen}
      onClose={handleClose}
      title="Telegram Notifications"
      size="sm"
    >
      <div className={styles.telegramConnect}>{renderContent()}</div>
    </Modal>
  );
};
