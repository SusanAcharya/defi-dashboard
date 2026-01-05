import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "@/services/notification.api";
import { formatDateTime } from "@/utils/format";
import { useWalletStore } from "@/store/walletStore";
import { Card } from "../Card/Card";
import styles from "./LatestNotifications.module.scss";

export const LatestNotifications: React.FC = () => {
  const { selectedWalletAddress, isGuest, wallets } = useWalletStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data: notifications = [], isLoading } = useQuery<any[]>({
    queryKey: ["notifications", selectedWalletAddress],
    queryFn: () => getNotifications(selectedWalletAddress),
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: !isGuest && !!selectedWalletAddress, // Don't fetch if guest or no wallet
  });

  // Get latest 5 notifications
  // On desktop: show all 5, on mobile: show 2 initially or 5 when expanded
  const allNotifications = isGuest ? [] : notifications?.slice(0, 5) || [];
  const latestNotifications =
    isMobile && !expanded ? allNotifications.slice(0, 2) : allNotifications;
  const hasMore = allNotifications.length > 2 && isMobile;

  if (isLoading && !isGuest) {
    return (
      <Card className={styles.latestNotifications}>
        <div className={styles.latestNotifications__header}>
          <div className={styles.latestNotifications__headerLeft}>
            <span className={styles.latestNotifications__bellIcon}>🔔</span>
            <span className={styles.latestNotifications__title}>
              LATEST ALERTS
            </span>
          </div>
        </div>
        <div className={styles.latestNotifications__separator} />
        <div className={styles.latestNotifications__empty}>Loading...</div>
      </Card>
    );
  }

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case "Swap":
        return "🔄";
      case "Transfer":
        return "📤";
      case "Contract":
        return "📋";
      case "Airdrop":
        return "🎁";
      case "Staking":
        return "💰";
      default:
        return "🖼️";
    }
  };

  return (
    <Card className={styles.latestNotifications}>
      <div className={styles.latestNotifications__header}>
        <div className={styles.latestNotifications__headerLeft}>
          <span className={styles.latestNotifications__bellIcon}>🔔</span>
          <span className={styles.latestNotifications__title}>
            LATEST ALERTS
          </span>
        </div>
        {hasMore && (
          <button
            className={styles.latestNotifications__expandButton}
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Show less" : "Show more"}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      <div className={styles.latestNotifications__separator} />
      <div className={styles.latestNotifications__list}>
        {latestNotifications.length > 0 ? (
          latestNotifications.map((notification) => (
            <div
              key={notification.id}
              className={styles.latestNotifications__item}
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
          ))
        ) : (
          <div className={styles.latestNotifications__empty}>
            {isGuest || wallets.length === 0 ? (
              <button
                className={styles.latestNotifications__connectButton}
                onClick={() => navigate("/wallet")}
              >
                Connect a wallet to receive notifications
              </button>
            ) : (
              "No Recent Notification"
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
