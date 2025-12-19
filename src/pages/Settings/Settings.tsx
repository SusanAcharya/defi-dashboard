import React, { useState } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '@/components';
import { formatAddress } from '@/utils/format';
import styles from './Settings.module.scss';

export const Settings: React.FC = () => {
  const { 
    settings, 
    walletNotificationSettings,
    wallets,
    updateSettings,
    updateWalletNotificationSettings,
    getWalletNotificationSettings,
  } = useWalletStore();

  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleWalletToggle = (address: string, key: keyof typeof walletNotificationSettings[0]) => {
    const walletSettings = getWalletNotificationSettings(address);
    if (walletSettings) {
      updateWalletNotificationSettings(address, { [key]: !walletSettings[key] });
    }
  };

  const notificationTypes = [
    { key: 'notifyTransactions' as const, label: 'Transactions', description: 'Get notified about all transactions' },
    { key: 'notifyReceives' as const, label: 'Receives', description: 'Get notified when you receive tokens' },
    { key: 'notifySends' as const, label: 'Sends', description: 'Get notified when you send tokens' },
    { key: 'notifyAirdrops' as const, label: 'Airdrops', description: 'Get notified about new airdrops' },
    { key: 'notifyStaking' as const, label: 'Staking', description: 'Get notified about staking activities' },
    { key: 'notifyLending' as const, label: 'Lending', description: 'Get notified about lending activities' },
    { key: 'notifySwaps' as const, label: 'Swaps', description: 'Get notified about token swaps' },
    { key: 'notifyNFTs' as const, label: 'NFTs', description: 'Get notified about NFT activities' },
  ];

  return (
    <div className={styles.settings}>
      {/* Notifications */}
      <Card title="Notifications">
        <div className={styles.settings__section}>
          <div className={styles.settings__item}>
            <div className={styles.settings__label}>
              <div className={styles.settings__title}>Telegram Alerts</div>
              <div className={styles.settings__description}>
                Receive notifications via Telegram
              </div>
            </div>
            <button
              className={`${styles.settings__toggle} ${
                settings.telegramAlerts ? styles.settings__toggle_active : ''
              }`}
              onClick={() => handleToggle('telegramAlerts')}
            >
              {settings.telegramAlerts ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={styles.settings__item}>
            <div className={styles.settings__label}>
              <div className={styles.settings__title}>Push Notifications</div>
              <div className={styles.settings__description}>
                Receive browser push notifications
              </div>
            </div>
            <button
              className={`${styles.settings__toggle} ${
                settings.pushNotifications ? styles.settings__toggle_active : ''
              }`}
              onClick={() => handleToggle('pushNotifications')}
            >
              {settings.pushNotifications ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </Card>

      {/* Notification Types */}
      <Card title="Notification Types">
        <div className={styles.settings__section}>
          {notificationTypes.map((type) => (
            <div key={type.key} className={styles.settings__item}>
              <div className={styles.settings__label}>
                <div className={styles.settings__title}>{type.label}</div>
                <div className={styles.settings__description}>
                  {type.description}
                </div>
              </div>
              <button
                className={`${styles.settings__toggle} ${
                  settings[type.key] ? styles.settings__toggle_active : ''
                }`}
                onClick={() => handleToggle(type.key)}
              >
                {settings[type.key] ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Wallet-Based Notification Settings */}
      <Card title="Wallet Notification Settings">
        <div className={styles.settings__section}>
          {wallets.length === 0 ? (
            <div className={styles.settings__emptyState}>
              <p>No wallets added. Add wallets from the Wallet page to configure notifications.</p>
            </div>
          ) : (
            wallets.map((wallet) => {
              const walletSettings = getWalletNotificationSettings(wallet.address) || {
                address: wallet.address,
                enabled: true,
                notifyTransactions: true,
                notifyReceives: true,
                notifySends: true,
                notifyAirdrops: true,
                notifyStaking: true,
                notifyLending: true,
                notifySwaps: true,
                notifyNFTs: true,
              };
              const isExpanded = expandedWallet === wallet.address;

              return (
                <div key={wallet.address} className={styles.settings__walletCard}>
                  <button
                    className={styles.settings__walletHeader}
                    onClick={() => setExpandedWallet(isExpanded ? null : wallet.address)}
                  >
                    <div className={styles.settings__walletInfo}>
                      <div className={styles.settings__walletName}>{wallet.name}</div>
                      <div className={styles.settings__walletAddress}>
                        {formatAddress(wallet.address, 4, 4)}
                      </div>
                    </div>
                    <div className={styles.settings__walletHeaderActions}>
                      <button
                        className={`${styles.settings__toggle} ${
                          walletSettings.enabled ? styles.settings__toggle_active : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWalletToggle(wallet.address, 'enabled');
                        }}
                      >
                        {walletSettings.enabled ? 'ON' : 'OFF'}
                      </button>
                      <span className={styles.settings__expandIcon}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={styles.settings__walletDetails}>
                      {notificationTypes.map((type) => (
                        <div key={type.key} className={styles.settings__walletDetailItem}>
                          <div className={styles.settings__label}>
                            <div className={styles.settings__title}>{type.label}</div>
                            <div className={styles.settings__description}>
                              {type.description}
                            </div>
                          </div>
                          <button
                            className={`${styles.settings__toggle} ${
                              walletSettings[type.key] ? styles.settings__toggle_active : ''
                            }`}
                            onClick={() => handleWalletToggle(wallet.address, type.key)}
                          >
                            {walletSettings[type.key] ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
