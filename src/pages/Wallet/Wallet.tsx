import React, { useState, useCallback } from 'react';
import { useWalletStore, TrackedWallet } from '@/store/walletStore';
import { Card, Button, Toast } from '@/components';
import { formatAddress } from '@/utils/format';
import styles from './Wallet.module.scss';

export const Wallet: React.FC = () => {
  const { wallets, addWallet, removeWallet, updateWallet } = useWalletStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletIsMine, setNewWalletIsMine] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const myWallets = wallets.filter(w => w.isMine);
  const otherWallets = wallets.filter(w => !w.isMine);

  const handleAddWallet = () => {
    if (!newWalletAddress.trim() || !newWalletName.trim()) {
      alert('Please enter both wallet address and name');
      return;
    }
    
    // Basic validation for Starknet address (should start with 0x and be 66 chars)
    if (!newWalletAddress.startsWith('0x') || newWalletAddress.length !== 66) {
      alert('Please enter a valid Starknet wallet address');
      return;
    }

    addWallet(newWalletAddress.trim(), newWalletName.trim(), newWalletIsMine);
    setNewWalletAddress('');
    setNewWalletName('');
    setNewWalletIsMine(true);
    setShowAddForm(false);
    
    // Show toast notification
    setToastMessage(`Wallet "${newWalletName.trim()}" added successfully`);
    setShowToast(true);
  };

  const handleToggleOwnership = (wallet: TrackedWallet) => {
    updateWallet(wallet.address, { isMine: !wallet.isMine });
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage('Wallet address copied to clipboard');
    setShowToast(true);
  };

  return (
    <div className={styles.wallet}>
      <Card title="Wallet Management">
        <div className={styles.wallet__addSection}>
          <Button
            variant="outline"
            onClick={() => setShowAddForm(!showAddForm)}
            className={styles.wallet__addButton}
          >
            {showAddForm ? '− Cancel' : '+ Add Wallet'}
          </Button>
          
          {showAddForm && (
            <div className={styles.wallet__addForm}>
              <div className={styles.wallet__formGroup}>
                <label className={styles.wallet__label}>Wallet Address</label>
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className={styles.wallet__input}
                />
              </div>
              <div className={styles.wallet__formGroup}>
                <label className={styles.wallet__label}>Wallet Name</label>
                <input
                  type="text"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="e.g., Main Wallet"
                  className={styles.wallet__input}
                />
              </div>
              <div className={styles.wallet__formGroup}>
                <div className={styles.wallet__radioContainer}>
                  <label className={styles.wallet__radioGroup}>
                    <input
                      type="radio"
                      checked={newWalletIsMine}
                      onChange={() => setNewWalletIsMine(true)}
                      className={styles.wallet__radio}
                    />
                    <span className={styles.wallet__radioLabel}>My Wallet</span>
                  </label>
                  <label className={styles.wallet__radioGroup}>
                    <input
                      type="radio"
                      checked={!newWalletIsMine}
                      onChange={() => setNewWalletIsMine(false)}
                      className={styles.wallet__radio}
                    />
                    <span className={styles.wallet__radioLabel}>Other's Wallet</span>
                  </label>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleAddWallet}
                className={styles.wallet__submitButton}
              >
                Add Wallet
              </Button>
            </div>
          )}
        </div>

        {/* My Wallets */}
        <div className={styles.wallet__section}>
          <h3 className={styles.wallet__sectionTitle}>My Wallets ({myWallets.length})</h3>
          {myWallets.length > 0 ? (
            <div className={styles.wallet__walletList}>
              {myWallets.map((wallet) => (
                <div key={wallet.address} className={styles.wallet__walletItem}>
                  <div className={styles.wallet__walletInfo}>
                    <div className={styles.wallet__walletIcon}>
                      <div className={styles.wallet__iconContainer}>🔷</div>
                    </div>
                    <div className={styles.wallet__walletDetails}>
                      <div className={styles.wallet__walletName}>{wallet.name}</div>
                      <button
                        className={styles.wallet__walletAddress}
                        onClick={() => handleCopyAddress(wallet.address)}
                        title="Click to copy address"
                      >
                        {formatAddress(wallet.address, 6, 4)}
                      </button>
                    </div>
                  </div>
                  <div className={styles.wallet__walletActions}>
                    <button
                      className={styles.wallet__toggleButton}
                      onClick={() => handleToggleOwnership(wallet)}
                      title="Mark as other's wallet"
                    >
                      👤
                    </button>
                    <button
                      className={styles.wallet__removeButton}
                      onClick={() => removeWallet(wallet.address)}
                      title="Remove wallet"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.wallet__emptyState}>
              <p>No wallets added yet. Add your first wallet above.</p>
            </div>
          )}
        </div>

        {/* Other Wallets */}
        <div className={styles.wallet__section}>
          <h3 className={styles.wallet__sectionTitle}>Other Wallets ({otherWallets.length})</h3>
          {otherWallets.length > 0 ? (
            <div className={styles.wallet__walletList}>
              {otherWallets.map((wallet) => (
                <div key={wallet.address} className={styles.wallet__walletItem}>
                  <div className={styles.wallet__walletInfo}>
                    <div className={styles.wallet__walletIcon}>
                      <div className={styles.wallet__iconContainer}>👁️</div>
                    </div>
                    <div className={styles.wallet__walletDetails}>
                      <div className={styles.wallet__walletName}>{wallet.name}</div>
                      <button
                        className={styles.wallet__walletAddress}
                        onClick={() => handleCopyAddress(wallet.address)}
                        title="Click to copy address"
                      >
                        {formatAddress(wallet.address, 6, 4)}
                      </button>
                    </div>
                  </div>
                  <div className={styles.wallet__walletActions}>
                    <button
                      className={styles.wallet__toggleButton}
                      onClick={() => handleToggleOwnership(wallet)}
                      title="Mark as my wallet"
                    >
                      👤
                    </button>
                    <button
                      className={styles.wallet__removeButton}
                      onClick={() => removeWallet(wallet.address)}
                      title="Remove wallet"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.wallet__emptyState}>
              <p>No other wallets being tracked.</p>
            </div>
          )}
        </div>
      </Card>
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
