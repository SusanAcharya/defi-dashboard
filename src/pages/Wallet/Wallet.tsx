import React from 'react';
import { useWalletStore } from '@/store/walletStore';
import { useUIStore } from '@/store/uiStore';
import { Card, Button } from '@/components';
import { formatAddress } from '@/utils/format';
import styles from './Wallet.module.scss';

export const Wallet: React.FC = () => {
  const { wallet, isConnected, disconnectWallet } = useWalletStore();
  const { setWalletConnectModalOpen } = useUIStore();

  const handleConnect = () => {
    setWalletConnectModalOpen(true);
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <div className={styles.wallet}>
      <Card title="WALLET MANAGEMENT">
        <div className={styles.wallet__section}>
          <h3 className={styles.wallet__sectionTitle}>Connected Wallets</h3>
          {isConnected && wallet ? (
            <div className={styles.wallet__connectedWallet}>
              <div className={styles.wallet__walletInfo}>
                <div className={styles.wallet__walletIcon}>🔷</div>
                <div className={styles.wallet__walletDetails}>
                  <div className={styles.wallet__walletName}>Argent X</div>
                  <div className={styles.wallet__walletAddress}>
                    {formatAddress(wallet.address)}
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className={styles.wallet__noWallet}>
              <p>No wallet connected</p>
            </div>
          )}
        </div>

        <div className={styles.wallet__section}>
          <h3 className={styles.wallet__sectionTitle}>Connect New Wallet</h3>
          <div className={styles.wallet__wallets}>
            <button
              className={styles.wallet__walletOption}
              onClick={handleConnect}
            >
              <div className={styles.wallet__walletOptionIcon}>🔷</div>
              <div className={styles.wallet__walletOptionInfo}>
                <div className={styles.wallet__walletOptionName}>Argent X</div>
                <div className={styles.wallet__walletOptionDescription}>
                  Connect using Argent X wallet
                </div>
              </div>
            </button>
            <button
              className={styles.wallet__walletOption}
              onClick={handleConnect}
            >
              <div className={styles.wallet__walletOptionIcon}>🔶</div>
              <div className={styles.wallet__walletOptionInfo}>
                <div className={styles.wallet__walletOptionName}>Braavos</div>
                <div className={styles.wallet__walletOptionDescription}>
                  Connect using Braavos wallet
                </div>
              </div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

