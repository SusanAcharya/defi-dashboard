import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/walletStore';
import { Card, Button } from '@/components';
import styles from './Settings.module.scss';

export const Settings: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    disconnectWallet,
  } = useWalletStore();
  
  const navigate = useNavigate();

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

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

      {/* Preferences */}
      <Card title="Preferences">
        <div className={styles.settings__section}>
          <div className={styles.settings__item}>
            <div className={styles.settings__label}>
              <div className={styles.settings__title}>Currency</div>
              <div className={styles.settings__description}>
                Display currency preference
              </div>
            </div>
            <select
              className={styles.settings__select}
              value={settings.currency}
              onChange={(e) =>
                updateSettings({
                  currency: e.target.value as 'USD' | 'EUR' | 'BTC',
                })
              }
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="BTC">BTC</option>
            </select>
          </div>

          <div className={styles.settings__item}>
            <div className={styles.settings__label}>
              <div className={styles.settings__title}>Theme</div>
              <div className={styles.settings__description}>
                Choose light or dark theme
              </div>
            </div>
            <select
              className={styles.settings__select}
              value={settings.theme}
              onChange={(e) =>
                updateSettings({
                  theme: e.target.value as 'light' | 'dark',
                })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div className={styles.settings__item}>
            <div className={styles.settings__label}>
              <div className={styles.settings__title}>Language</div>
              <div className={styles.settings__description}>
                Select your preferred language
              </div>
            </div>
            <select
              className={styles.settings__select}
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.settings__danger}>
          <Button variant="danger" onClick={handleDisconnect}>
            Disconnect Wallet
          </Button>
        </div>
      </Card>
    </div>
  );
};
