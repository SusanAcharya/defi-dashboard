import React from "react";
import { useTelegramAuth } from "../../hooks/useTelegramAuth";
import styles from "./TelegramInfo.module.scss";

/**
 * Component to display Telegram user information in the app
 * Shows when app is running inside Telegram
 */
export const TelegramInfo: React.FC = () => {
  const { user, isInTelegram, error } = useTelegramAuth();

  if (!isInTelegram) {
    return null;
  }

  if (error) {
    return (
      <div className={styles.telegramInfo} title={error}>
        <span className={styles.warning}>⚠️</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.telegramInfo}>
      <div className={styles.userInfo}>
        <span className={styles.badge}>📱 Telegram</span>
        <span className={styles.username}>
          {user.first_name}
          {user.last_name ? ` ${user.last_name}` : ""}
        </span>
      </div>
    </div>
  );
};
