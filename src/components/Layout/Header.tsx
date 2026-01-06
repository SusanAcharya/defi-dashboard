import React from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import logoImage from "@/assets/logo.png";
import walletIcon from "@/assets/icons/wallet.png";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__left}>
          <div className={styles.header__logo} onClick={() => navigate("/")}>
            <img
              src={logoImage}
              alt="KOMPASS"
              className={styles.header__logoImage}
            />
            <span className={styles.header__logoText}>KOMPASS</span>
          </div>
        </div>
        <div className={styles.header__actions}>
          <button
            className={styles.header__walletIcon}
            onClick={() => navigate("/wallet")}
            aria-label="Wallet"
            title="Wallet Management"
          >
            <img
              src={walletIcon}
              alt="Wallet"
              className={styles.header__iconImage}
            />
          </button>

          <button
            className={styles.header__menuButton}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`${styles.header__menuIcon} ${
                mobileNavOpen ? styles.header__menuIcon_open : ""
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
