import React from 'react';
import { Modal } from '@/components';
import { useUIStore } from '@/store/uiStore';
import styles from './WalletConnectModal.module.scss';

export const WalletConnectModal: React.FC = () => {
  const { walletConnectModalOpen, setWalletConnectModalOpen } = useUIStore();

  const handleConnect = () => {
    // Wallet connection is no longer needed - users add wallets manually
    setWalletConnectModalOpen(false);
  };

  return (
    <Modal
      isOpen={walletConnectModalOpen}
      onClose={() => setWalletConnectModalOpen(false)}
      title="Connect Wallet"
    >
      <div className={styles.walletConnect}>
        <p className={styles.walletConnect__description}>
          Connect your StarkNet wallet to get started
        </p>
        <div className={styles.walletConnect__wallets}>
          <button
            className={styles.walletConnect__wallet}
            onClick={handleConnect}
          >
            <div className={styles.walletConnect__walletIcon}>🔷</div>
            <div className={styles.walletConnect__walletInfo}>
              <div className={styles.walletConnect__walletName}>Argent X</div>
              <div className={styles.walletConnect__walletDescription}>
                Connect using Argent X wallet
              </div>
            </div>
          </button>
          <button
            className={styles.walletConnect__wallet}
            onClick={handleConnect}
          >
            <div className={styles.walletConnect__walletIcon}>🔶</div>
            <div className={styles.walletConnect__walletInfo}>
              <div className={styles.walletConnect__walletName}>Braavos</div>
              <div className={styles.walletConnect__walletDescription}>
                Connect using Braavos wallet
              </div>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};

