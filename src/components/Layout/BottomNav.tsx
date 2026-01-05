import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount, useConnect } from "@starknet-react/core";
import { useWalletStore } from "@/store/walletStore";

import { Toast } from "@/components/Toast/Toast";
import homeIcon from "@/assets/icons/home.png";
import walletIcon from "@/assets/icons/wallet.png";
import profileImage from "@/assets/profile.png";
import styles from "./BottomNav.module.scss";

// Use the same icons as sidebar
const overviewIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='20' x2='12' y2='10'%3E%3C/line%3E%3Cline x1='18' y1='20' x2='18' y2='4'%3E%3C/line%3E%3Cline x1='6' y1='20' x2='6' y2='16'%3E%3C/line%3E%3C/svg%3E";
const activityIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E";

const mobileNavItems = [
  { path: "/", label: "Home", icon: null, iconImage: homeIcon },
  {
    path: "/portfolio",
    label: "Overview",
    icon: null,
    iconImage: overviewIcon,
  },
  { path: "/wallet", label: "Wallets", icon: null, iconImage: walletIcon },
  { path: "/history", label: "Activity", icon: null, iconImage: activityIcon },
  { path: "/profile", label: "Profile", icon: null, iconImage: profileImage },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { wallets } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const handleProfileClick = async () => {
    // If already connected, navigate to profile
    if (address || wallets.length > 0) {
      navigate("/profile");
      return;
    }

    // Otherwise, trigger wallet connection
    try {
      setIsConnecting(true);
      const connector = connectors[0];
      if (!connector) {
        setToastMessage({
          message: "No wallet connectors available",
          type: "error",
        });
        return;
      }

      await connect({ connector });

      // Connection successful - the useEffect in Header will handle the rest
      setToastMessage({
        message: "Connecting wallet...",
        type: "info",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect wallet";
      setToastMessage({
        message: `Connection failed: ${errorMessage}`,
        type: "error",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNavClick = (path: string) => {
    if (path === "/profile") {
      handleProfileClick();
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <nav className={styles.bottomNav}>
        {mobileNavItems.map((item) => (
          <button
            key={item.path}
            className={`${styles.bottomNav__item} ${
              location.pathname === item.path
                ? styles.bottomNav__item_active
                : ""
            } ${
              item.path === "/profile" && isConnecting
                ? styles.bottomNav__item_connecting
                : ""
            }`}
            onClick={() => handleNavClick(item.path)}
            disabled={item.path === "/profile" && isConnecting}
          >
            {item.iconImage ? (
              <img
                src={item.iconImage}
                alt={item.label}
                className={styles.bottomNav__iconImage}
              />
            ) : (
              <span className={styles.bottomNav__icon}>{item.icon}</span>
            )}
            <span className={styles.bottomNav__label}>
              {item.path === "/profile" && isConnecting
                ? "Connecting..."
                : item.label}
            </span>
          </button>
        ))}
      </nav>
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          duration={3000}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};
