import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/walletStore';
import profileImage from '@/assets/profile.png';
import logoImage from '@/assets/logo.png';
import walletIcon from '@/assets/icons/wallet.png';
import settingsIcon from '@/assets/icons/settings.png';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, isConnected } = useWalletStore();

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__logo} onClick={() => navigate('/')}>
          <img 
            src={logoImage} 
            alt="Kompass Finance" 
            className={styles.header__logoImage}
          />
          <span className={styles.header__logoText}>Kompass Finance</span>
        </div>
        <div className={styles.header__actions}>
          {isConnected && wallet && (
            <div className={styles.header__wallet}>
              {wallet.shortAddress}
            </div>
          )}
          <button
            className={styles.header__walletIcon}
            onClick={() => navigate('/wallet')}
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
            className={styles.header__settingsIcon}
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            title="Settings"
          >
            <img 
              src={settingsIcon} 
              alt="Settings"
              className={styles.header__iconImage}
            />
          </button>
          <button
            className={styles.header__profile}
            onClick={() => navigate('/settings')}
            aria-label="Profile"
          >
            <img 
              src={profileImage} 
              alt="Profile" 
              className={styles.header__avatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

