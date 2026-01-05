import React, { useState } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useUIStore } from "@/store/uiStore";
import { Card } from "@/components";
import { formatAddress } from "@/utils/format";
import styles from "./Settings.module.scss";

const PROTOCOLS = ["JediSwap", "10KSwap", "Ekubo", "zkLend"];

export const Settings: React.FC = () => {
  const {
    settings,
    walletNotificationSettings,
    wallets,
    updateSettings,
    updateWalletNotificationSettings,
    getWalletNotificationSettings,
  } = useWalletStore();
  const { setTelegramConnectModalOpen } = useUIStore();

  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<{
    wallet: string;
    section: "categories" | "protocols" | "activities";
  } | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleTelegramConnect = () => {
    setTelegramConnectModalOpen(true);
  };

  const handleWalletToggle = (
    address: string,
    key: keyof (typeof walletNotificationSettings)[0]
  ) => {
    const walletSettings = getWalletNotificationSettings(address);
    if (walletSettings) {
      updateWalletNotificationSettings(address, {
        [key]: !walletSettings[key],
      });
    }
  };

  const handleProtocolToggle = (address: string, protocol: string) => {
    const walletSettings = getWalletNotificationSettings(address);
    if (walletSettings) {
      const updatedProtocols = {
        ...walletSettings.notifyProtocols,
        [protocol]: !walletSettings.notifyProtocols[protocol],
      };
      updateWalletNotificationSettings(address, {
        notifyProtocols: updatedProtocols,
      });
    }
  };

  const generalNotificationTypes = [
    {
      key: "notifyTransactions" as const,
      label: "Transactions",
      description: "General transaction notifications",
    },
    {
      key: "notifyAirdrops" as const,
      label: "Airdrops",
      description: "New airdrop opportunities",
    },
    {
      key: "notifyStaking" as const,
      label: "Staking",
      description: "Staking opportunities and updates",
    },
    {
      key: "notifyLending" as const,
      label: "Lending",
      description: "Lending opportunities and updates",
    },
  ];

  const walletCategoryTypes = [
    {
      key: "notifyTransactions" as const,
      label: "Transactions",
      description: "All transaction activities",
    },
    {
      key: "notifyReceives" as const,
      label: "Receives",
      description: "Incoming token transfers",
    },
    {
      key: "notifySends" as const,
      label: "Sends",
      description: "Outgoing token transfers",
    },
    {
      key: "notifySwaps" as const,
      label: "Swaps",
      description: "Token swap activities",
    },
    {
      key: "notifyStaking" as const,
      label: "Staking",
      description: "Staking activities",
    },
    {
      key: "notifyLending" as const,
      label: "Lending",
      description: "Lending activities",
    },
    {
      key: "notifyAirdrops" as const,
      label: "Airdrops",
      description: "Airdrop activities",
    },
    {
      key: "notifyNFTs" as const,
      label: "NFTs",
      description: "NFT-related activities",
    },
  ];

  return (
    <div className={styles.settings}>
      {/* General Notifications */}
      <Card title="General Notifications">
        <div className={styles.settings__sectionDescription}>
          General notifications that are not wallet-related
        </div>
        <div className={styles.settings__section}>
          <div className={styles.settings__item}>
            <div className={styles.settings__label}>
              <div className={styles.settings__title}>Telegram Alerts</div>
              <div className={styles.settings__description}>
                {settings.telegramAlerts
                  ? "Connected - Receiving notifications via Telegram"
                  : "Connect Telegram to receive notifications"}
              </div>
            </div>
            <div className={styles.settings__actions}>
              {settings.telegramAlerts ? (
                <button
                  className={`${styles.settings__toggle} ${styles.settings__toggle_active}`}
                  onClick={() => handleToggle("telegramAlerts")}
                >
                  ON
                </button>
              ) : (
                <button
                  className={styles.settings__connectButton}
                  onClick={handleTelegramConnect}
                >
                  Connect
                </button>
              )}
            </div>
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
                settings.pushNotifications ? styles.settings__toggle_active : ""
              }`}
              onClick={() => handleToggle("pushNotifications")}
            >
              {settings.pushNotifications ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className={styles.settings__subsection}>
          <div className={styles.settings__subsectionTitle}>
            Notification Categories
          </div>
          <div className={styles.settings__section}>
            {generalNotificationTypes.map((type) => (
              <div key={type.key} className={styles.settings__item}>
                <div className={styles.settings__label}>
                  <div className={styles.settings__title}>{type.label}</div>
                  <div className={styles.settings__description}>
                    {type.description}
                  </div>
                </div>
                <button
                  className={`${styles.settings__toggle} ${
                    settings[type.key] ? styles.settings__toggle_active : ""
                  }`}
                  onClick={() => handleToggle(type.key)}
                >
                  {settings[type.key] ? "ON" : "OFF"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Wallet-Based Notification Settings */}
      <Card title="Wallet-Based Notifications">
        <div className={styles.settings__sectionDescription}>
          Configure notifications for each wallet individually
        </div>
        <div className={styles.settings__section}>
          {wallets.length === 0 ? (
            <div className={styles.settings__emptyState}>
              <p>
                No wallets added. Add wallets from the Wallet page to configure
                notifications.
              </p>
            </div>
          ) : (
            wallets.map((wallet) => {
              const walletSettings = getWalletNotificationSettings(
                wallet.address
              ) || {
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
                notifyProtocols: {
                  JediSwap: true,
                  "10KSwap": true,
                  Ekubo: true,
                  zkLend: true,
                },
                notifyContractInteractions: true,
                notifyFailedTransactions: true,
                notifyPendingTransactions: true,
              };
              const isExpanded = expandedWallet === wallet.address;
              const categoriesExpanded =
                expandedSection?.wallet === wallet.address &&
                expandedSection?.section === "categories";
              const protocolsExpanded =
                expandedSection?.wallet === wallet.address &&
                expandedSection?.section === "protocols";
              const activitiesExpanded =
                expandedSection?.wallet === wallet.address &&
                expandedSection?.section === "activities";

              return (
                <div
                  key={wallet.address}
                  className={styles.settings__walletCard}
                >
                  <button
                    className={styles.settings__walletHeader}
                    onClick={() =>
                      setExpandedWallet(isExpanded ? null : wallet.address)
                    }
                  >
                    <div className={styles.settings__walletInfo}>
                      <div className={styles.settings__walletName}>
                        {wallet.name}
                      </div>
                      <div className={styles.settings__walletAddress}>
                        {formatAddress(wallet.address, 4, 4)}
                      </div>
                    </div>
                    <div className={styles.settings__walletHeaderActions}>
                      <button
                        className={`${styles.settings__toggle} ${
                          walletSettings.enabled
                            ? styles.settings__toggle_active
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWalletToggle(wallet.address, "enabled");
                        }}
                      >
                        {walletSettings.enabled ? "ON" : "OFF"}
                      </button>
                      <span className={styles.settings__expandIcon}>
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={styles.settings__walletDetails}>
                      {/* Categories Section */}
                      <div className={styles.settings__walletSubsection}>
                        <button
                          className={styles.settings__walletSubsectionHeader}
                          onClick={() =>
                            setExpandedSection(
                              categoriesExpanded
                                ? null
                                : {
                                    wallet: wallet.address,
                                    section: "categories",
                                  }
                            )
                          }
                        >
                          <span
                            className={styles.settings__walletSubsectionTitle}
                          >
                            Categories
                          </span>
                          <span className={styles.settings__expandIcon}>
                            {categoriesExpanded ? "▲" : "▼"}
                          </span>
                        </button>
                        {categoriesExpanded && (
                          <div
                            className={styles.settings__walletSubsectionContent}
                          >
                            {walletCategoryTypes.map((type) => (
                              <div
                                key={type.key}
                                className={styles.settings__walletDetailItem}
                              >
                                <div className={styles.settings__label}>
                                  <div className={styles.settings__title}>
                                    {type.label}
                                  </div>
                                  <div className={styles.settings__description}>
                                    {type.description}
                                  </div>
                                </div>
                                <button
                                  className={`${styles.settings__toggle} ${
                                    walletSettings[type.key]
                                      ? styles.settings__toggle_active
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleWalletToggle(wallet.address, type.key)
                                  }
                                >
                                  {walletSettings[type.key] ? "ON" : "OFF"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Protocols Section */}
                      <div className={styles.settings__walletSubsection}>
                        <button
                          className={styles.settings__walletSubsectionHeader}
                          onClick={() =>
                            setExpandedSection(
                              protocolsExpanded
                                ? null
                                : {
                                    wallet: wallet.address,
                                    section: "protocols",
                                  }
                            )
                          }
                        >
                          <span
                            className={styles.settings__walletSubsectionTitle}
                          >
                            Protocols
                          </span>
                          <span className={styles.settings__expandIcon}>
                            {protocolsExpanded ? "▲" : "▼"}
                          </span>
                        </button>
                        {protocolsExpanded && (
                          <div
                            className={styles.settings__walletSubsectionContent}
                          >
                            {PROTOCOLS.map((protocol) => (
                              <div
                                key={protocol}
                                className={styles.settings__walletDetailItem}
                              >
                                <div className={styles.settings__label}>
                                  <div className={styles.settings__title}>
                                    {protocol}
                                  </div>
                                  <div className={styles.settings__description}>
                                    Notifications for {protocol} activities
                                  </div>
                                </div>
                                <button
                                  className={`${styles.settings__toggle} ${
                                    walletSettings.notifyProtocols[protocol]
                                      ? styles.settings__toggle_active
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleProtocolToggle(
                                      wallet.address,
                                      protocol
                                    )
                                  }
                                >
                                  {walletSettings.notifyProtocols[protocol]
                                    ? "ON"
                                    : "OFF"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Blockchain Activities Section */}
                      <div className={styles.settings__walletSubsection}>
                        <button
                          className={styles.settings__walletSubsectionHeader}
                          onClick={() =>
                            setExpandedSection(
                              activitiesExpanded
                                ? null
                                : {
                                    wallet: wallet.address,
                                    section: "activities",
                                  }
                            )
                          }
                        >
                          <span
                            className={styles.settings__walletSubsectionTitle}
                          >
                            Blockchain Activities
                          </span>
                          <span className={styles.settings__expandIcon}>
                            {activitiesExpanded ? "▲" : "▼"}
                          </span>
                        </button>
                        {activitiesExpanded && (
                          <div
                            className={styles.settings__walletSubsectionContent}
                          >
                            <div className={styles.settings__walletDetailItem}>
                              <div className={styles.settings__label}>
                                <div className={styles.settings__title}>
                                  Contract Interactions
                                </div>
                                <div className={styles.settings__description}>
                                  Notifications for smart contract interactions
                                </div>
                              </div>
                              <button
                                className={`${styles.settings__toggle} ${
                                  walletSettings.notifyContractInteractions
                                    ? styles.settings__toggle_active
                                    : ""
                                }`}
                                onClick={() =>
                                  handleWalletToggle(
                                    wallet.address,
                                    "notifyContractInteractions"
                                  )
                                }
                              >
                                {walletSettings.notifyContractInteractions
                                  ? "ON"
                                  : "OFF"}
                              </button>
                            </div>
                            <div className={styles.settings__walletDetailItem}>
                              <div className={styles.settings__label}>
                                <div className={styles.settings__title}>
                                  Failed Transactions
                                </div>
                                <div className={styles.settings__description}>
                                  Notifications when transactions fail
                                </div>
                              </div>
                              <button
                                className={`${styles.settings__toggle} ${
                                  walletSettings.notifyFailedTransactions
                                    ? styles.settings__toggle_active
                                    : ""
                                }`}
                                onClick={() =>
                                  handleWalletToggle(
                                    wallet.address,
                                    "notifyFailedTransactions"
                                  )
                                }
                              >
                                {walletSettings.notifyFailedTransactions
                                  ? "ON"
                                  : "OFF"}
                              </button>
                            </div>
                            <div className={styles.settings__walletDetailItem}>
                              <div className={styles.settings__label}>
                                <div className={styles.settings__title}>
                                  Pending Transactions
                                </div>
                                <div className={styles.settings__description}>
                                  Notifications for pending transaction status
                                </div>
                              </div>
                              <button
                                className={`${styles.settings__toggle} ${
                                  walletSettings.notifyPendingTransactions
                                    ? styles.settings__toggle_active
                                    : ""
                                }`}
                                onClick={() =>
                                  handleWalletToggle(
                                    wallet.address,
                                    "notifyPendingTransactions"
                                  )
                                }
                              >
                                {walletSettings.notifyPendingTransactions
                                  ? "ON"
                                  : "OFF"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
