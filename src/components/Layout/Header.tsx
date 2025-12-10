import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/walletStore';
import { useUIStore } from '@/store/uiStore';
import profileImage from '@/assets/profile.png';
import logoImage from '@/assets/logo.png';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, isConnected } = useWalletStore();
  const { setWalletConnectModalOpen } = useUIStore();

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
          {isConnected && wallet ? (
            <div className={styles.header__wallet}>
              {wallet.shortAddress}
            </div>
          ) : (
            <button
              className={styles.header__connect}
              onClick={() => setWalletConnectModalOpen(true)}
            >
              Connect Wallet
            </button>
          )}
          <button
            className={styles.header__profile}
            onClick={() => navigate('/settings')}
            aria-label="Settings"
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

