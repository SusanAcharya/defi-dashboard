import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletStore, TrackedWallet } from "@/store/walletStore";
import { Card, Toast } from "@/components";
import { formatAddress } from "@/utils/format";
import { walletAPI, WalletSubscription } from "@/services/wallet.api";
import { authAPI } from "@/services/auth.api";
import styles from "./Wallet.module.scss";

export const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const {
    wallets,
    removeWallet,
    updateWallet,
    isGuest,
    loginWithTelegram,
    setSelectedWallet,
    clearAllWallets,
  } = useWalletStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletIsMine, setNewWalletIsMine] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "edit" | "remove" | "switch" | null
  >(null);
  const [selectedWalletForModal, setSelectedWalletForModal] =
    useState<TrackedWallet | null>(null);
  const [editName, setEditName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Subscribed wallets state
  const [subscribedWallets, setSubscribedWallets] = useState<
    WalletSubscription[]
  >([]);
  const [expandedSubscribedWallet, setExpandedSubscribedWallet] = useState<
    string | null
  >(null);

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);

  // Load subscribed wallets
  useEffect(() => {
    const loadSubscribedWallets = async () => {
      if (wallets.length === 0) return;

      try {
        // Fetch subscribed wallets for the first wallet in the list
        const mainWallet = wallets[0];
        const subscribedList = await walletAPI.getSubscribedWallets(
          mainWallet.address
        );

        console.log("API Response:", subscribedList);

        if (subscribedList && Array.isArray(subscribedList)) {
          // Get all user's wallet addresses (lowercase for comparison)
          const userWalletAddresses = wallets.map((w) =>
            w.address.toLowerCase()
          );

          // Filter out subscribed wallets that match any of the user's wallets
          const filteredSubscribed = subscribedList.filter(
            (sub) =>
              !userWalletAddresses.includes(sub.walletAddress.toLowerCase())
          );
          setSubscribedWallets(filteredSubscribed);
        } else {
          setSubscribedWallets([]);
        }
      } catch (error) {
        setToastMessage("Failed to load subscribed wallets");
        setShowToast(true);
      }
    };

    loadSubscribedWallets();
  }, [wallets]);

  const handleAddWallet = async () => {
    if (!newWalletAddress.trim() || !newWalletName.trim()) {
      setToastMessage("Please enter both wallet address and name");
      setShowToast(true);
      return;
    }

    // Basic validation for Starknet address (should start with 0x and be 66 chars)
    if (!newWalletAddress.startsWith("0x") || newWalletAddress.length !== 66) {
      setToastMessage("Please enter a valid Starknet wallet address");
      setShowToast(true);
      return;
    }

    try {
      const walletAddress = newWalletAddress.trim();
      const walletName = newWalletName.trim();

      // Check if this is the first wallet (onboarding) or adding to existing
      if (wallets.length === 0) {
        // ONBOARDING FLOW: First wallet being added
        await authAPI.onboard(walletAddress);
        setToastMessage("Wallet onboarded successfully");
      } else {
        // ADD SUBSCRIPTION FLOW: Additional wallet being added
        const mainWallet = wallets[0];
        await authAPI.addSubscription(
          mainWallet.address,
          walletAddress,
          walletName
        );

        // Reload subscribed wallets
        try {
          const subscribedList = await walletAPI.getSubscribedWallets(
            mainWallet.address
          );
          if (subscribedList && Array.isArray(subscribedList)) {
            const userWalletAddresses = wallets.map((w) =>
              w.address.toLowerCase()
            );
            const filteredSubscribed = subscribedList.filter(
              (sub) =>
                !userWalletAddresses.includes(sub.walletAddress.toLowerCase())
            );
            setSubscribedWallets(filteredSubscribed);
          }
        } catch (error) {
          console.error("Error reloading subscribed wallets:", error);
        }

        setToastMessage("Wallet subscription added successfully");
      }

      // Add wallet to local store
      const { addWallet } = useWalletStore.getState();
      addWallet(walletAddress, walletName, newWalletIsMine);

      // Reset form
      setNewWalletAddress("");
      setNewWalletName("");
      setNewWalletIsMine(true);
      setShowAddForm(false);
      setShowToast(true);
    } catch (error) {
      console.error("Error adding wallet:", error);
      setToastMessage(
        error instanceof Error ? error.message : "Failed to add wallet"
      );
      setShowToast(true);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage("Wallet address copied to clipboard");
    setShowToast(true);
  };

  const handleExpandWallet = (address: string) => {
    setExpandedWallet(expandedWallet === address ? null : address);
  };

  const handleOpenModal = (
    type: "edit" | "remove" | "switch",
    wallet: TrackedWallet
  ) => {
    setModalType(type);
    setSelectedWalletForModal(wallet);
    setEditName(wallet.name);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedWalletForModal(null);
    setEditName("");
  };

  const handleSaveEdit = () => {
    if (selectedWalletForModal && editName.trim()) {
      updateWallet(selectedWalletForModal.address, { name: editName.trim() });
      setToastMessage("Wallet name updated");
      setShowToast(true);
      handleCloseModal();
    }
  };

  const handleConfirmRemove = () => {
    if (selectedWalletForModal) {
      removeWallet(selectedWalletForModal.address);
      setToastMessage("Wallet removed");
      setShowToast(true);
      handleCloseModal();
      setExpandedWallet(null);
    }
  };

  const handleSwitchOwnership = () => {
    if (selectedWalletForModal) {
      updateWallet(selectedWalletForModal.address, {
        isMine: !selectedWalletForModal.isMine,
      });
      setToastMessage(
        `Wallet marked as ${
          !selectedWalletForModal.isMine ? "My Wallet" : "Other's Wallet"
        }`
      );
      setShowToast(true);
      handleCloseModal();
    }
  };

  const handleRemoveSubscribedWallet = async (
    subscribedWalletAddress: string
  ) => {
    if (wallets.length === 0) {
      setToastMessage("No main wallet available");
      setShowToast(true);
      return;
    }

    try {
      const mainWallet = wallets[0];
      await walletAPI.removeSubscribedWallet(
        mainWallet.address,
        subscribedWalletAddress
      );

      // Remove from local state
      setSubscribedWallets(
        subscribedWallets.filter(
          (w) => w.walletAddress !== subscribedWalletAddress
        )
      );
      setExpandedSubscribedWallet(null);

      setToastMessage("Subscription removed successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error removing subscription:", error);
      setToastMessage("Failed to remove subscription");
      setShowToast(true);
    }
  };

  const handleViewPortfolio = (address: string) => {
    setSelectedWallet(address);
    navigate("/portfolio");
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className={styles.wallet}>
      <Card title="Wallet Management">
        <div className={styles.wallet__addSection}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={styles.wallet__addButton}
          >
            <span className={styles.wallet__addButtonIcon}>
              {showAddForm ? "−" : "+"}
            </span>
            <span className={styles.wallet__addButtonText}>
              {showAddForm ? "Cancel" : "Add New Wallet"}
            </span>
          </button>

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
                    <span className={styles.wallet__radioLabel}>
                      Other's Wallet
                    </span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleAddWallet}
                className={styles.wallet__submitButton}
              >
                <span className={styles.wallet__submitButtonIcon}>✓</span>
                <span>Add Wallet</span>
              </button>
            </div>
          )}
        </div>

        {/* Wallet Cards */}
        <div className={styles.wallet__cards}>
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <div key={wallet.address} className={styles.wallet__card}>
                <div className={styles.wallet__cardHeader}>
                  <div
                    className={styles.wallet__cardAddress}
                    onClick={() => handleCopyAddress(wallet.address)}
                  >
                    <span className={styles.wallet__cardAddressText}>
                      {formatAddress(wallet.address, 8, 8)}
                    </span>
                    <span className={styles.wallet__cardCopyIcon}>📋</span>
                  </div>
                  <button
                    className={`${styles.wallet__cardExpand} ${
                      expandedWallet === wallet.address
                        ? styles.wallet__cardExpand_active
                        : ""
                    }`}
                    onClick={() => handleExpandWallet(wallet.address)}
                    aria-label={
                      expandedWallet === wallet.address ? "Collapse" : "Expand"
                    }
                  >
                    {expandedWallet === wallet.address ? "▼" : "▶"}
                  </button>
                </div>

                {expandedWallet === wallet.address && (
                  <div className={styles.wallet__cardContent}>
                    <div className={styles.wallet__cardInfo}>
                      <div className={styles.wallet__cardName}>
                        <span className={styles.wallet__cardNameLabel}>
                          Name:
                        </span>
                        <span className={styles.wallet__cardNameValue}>
                          {wallet.name}
                        </span>
                      </div>
                      <div className={styles.wallet__cardType}>
                        <span className={styles.wallet__cardTypeLabel}>
                          Type:
                        </span>
                        <span className={styles.wallet__cardTypeValue}>
                          {wallet.isMine ? "My Wallet" : "Other's Wallet"}
                        </span>
                      </div>
                    </div>
                    <div className={styles.wallet__cardActions}>
                      <button
                        className={styles.wallet__cardActionButton}
                        onClick={() => handleViewPortfolio(wallet.address)}
                      >
                        <span className={styles.wallet__cardActionIcon}>
                          📊
                        </span>
                        View Portfolio
                      </button>
                      <button
                        className={styles.wallet__cardActionButton}
                        onClick={() => handleOpenModal("edit", wallet)}
                      >
                        <span className={styles.wallet__cardActionIcon}>
                          ✏️
                        </span>
                        Edit Name
                      </button>
                      <button
                        className={styles.wallet__cardActionButton}
                        onClick={() => handleOpenModal("switch", wallet)}
                      >
                        <span className={styles.wallet__cardActionIcon}>
                          🔄
                        </span>
                        Switch Type
                      </button>
                      <button
                        className={`${styles.wallet__cardActionButton} ${styles.wallet__cardActionButton_danger}`}
                        onClick={() => handleOpenModal("remove", wallet)}
                      >
                        <span className={styles.wallet__cardActionIcon}>
                          🗑️
                        </span>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.wallet__emptyState}>
              <p>No wallets added yet. Add your first wallet above.</p>
            </div>
          )}
        </div>

        {/* Subscribed Wallets Section */}
        {subscribedWallets.length > 0 && (
          <div className={styles.wallet__subscribedSection}>
            <div className={styles.wallet__cards}>
              {subscribedWallets.map((subWallet) => (
                <div
                  key={subWallet.walletAddress}
                  className={styles.wallet__card}
                >
                  <div className={styles.wallet__cardHeader}>
                    <div
                      className={styles.wallet__cardAddress}
                      onClick={() => handleCopyAddress(subWallet.walletAddress)}
                    >
                      <span className={styles.wallet__cardAddressText}>
                        {formatAddress(subWallet.walletAddress, 8, 8)}
                      </span>
                      <span className={styles.wallet__cardCopyIcon}>📋</span>
                    </div>
                    <button
                      className={`${styles.wallet__cardExpand} ${
                        expandedSubscribedWallet === subWallet.walletAddress
                          ? styles.wallet__cardExpand_active
                          : ""
                      }`}
                      onClick={() =>
                        setExpandedSubscribedWallet(
                          expandedSubscribedWallet === subWallet.walletAddress
                            ? null
                            : subWallet.walletAddress
                        )
                      }
                      aria-label={
                        expandedSubscribedWallet === subWallet.walletAddress
                          ? "Collapse"
                          : "Expand"
                      }
                    >
                      {expandedSubscribedWallet === subWallet.walletAddress
                        ? "▼"
                        : "▶"}
                    </button>
                  </div>

                  {expandedSubscribedWallet === subWallet.walletAddress && (
                    <div className={styles.wallet__cardContent}>
                      <div className={styles.wallet__cardInfo}>
                        <div className={styles.wallet__cardName}>
                          <span className={styles.wallet__cardNameLabel}>
                            Name:
                          </span>
                          <span className={styles.wallet__cardNameValue}>
                            {subWallet.name}
                          </span>
                        </div>
                        <div className={styles.wallet__cardType}>
                          <span className={styles.wallet__cardTypeLabel}>
                            Type:
                          </span>
                          <span className={styles.wallet__cardTypeValue}>
                            📡 Subscribed
                          </span>
                        </div>
                      </div>
                      <div className={styles.wallet__cardActions}>
                        <button
                          className={styles.wallet__cardActionButton}
                          onClick={() =>
                            handleViewPortfolio(subWallet.walletAddress)
                          }
                        >
                          <span className={styles.wallet__cardActionIcon}>
                            📊
                          </span>
                          View Portfolio
                        </button>
                        <button
                          className={`${styles.wallet__cardActionButton} ${styles.wallet__cardActionButton_danger}`}
                          onClick={() =>
                            handleRemoveSubscribedWallet(
                              subWallet.walletAddress
                            )
                          }
                        >
                          <span className={styles.wallet__cardActionIcon}>
                            🗑️
                          </span>
                          Remove Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal/Popup */}
      {showModal && selectedWalletForModal && (
        <div className={styles.wallet__modalOverlay}>
          <div className={styles.wallet__modal} ref={modalRef}>
            <div className={styles.wallet__modalHeader}>
              <h3 className={styles.wallet__modalTitle}>
                {modalType === "edit" && "Edit Wallet Name"}
                {modalType === "remove" && "Remove Wallet"}
                {modalType === "switch" && "Switch Wallet Type"}
              </h3>
              <button
                className={styles.wallet__modalClose}
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className={styles.wallet__modalContent}>
              {modalType === "edit" && (
                <>
                  <div className={styles.wallet__modalText}>
                    Update the name for wallet: <br />
                    <span className={styles.wallet__modalAddress}>
                      {formatAddress(selectedWalletForModal.address, 8, 8)}
                    </span>
                  </div>
                  <div className={styles.wallet__formGroup}>
                    <label className={styles.wallet__label}>Wallet Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g., Main Wallet"
                      className={styles.wallet__input}
                      autoFocus
                    />
                  </div>
                  <div className={styles.wallet__modalActions}>
                    <button
                      className={styles.wallet__modalButton}
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.wallet__modalButton} ${styles.wallet__modalButton_primary}`}
                      onClick={handleSaveEdit}
                      disabled={!editName.trim()}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
              {modalType === "remove" && (
                <>
                  <div className={styles.wallet__modalText}>
                    Are you sure you want to remove this wallet?
                  </div>
                  <div className={styles.wallet__modalWalletInfo}>
                    <div className={styles.wallet__modalWalletName}>
                      {selectedWalletForModal.name}
                    </div>
                    <div className={styles.wallet__modalWalletAddress}>
                      {formatAddress(selectedWalletForModal.address, 8, 8)}
                    </div>
                  </div>
                  <div className={styles.wallet__modalActions}>
                    <button
                      className={styles.wallet__modalButton}
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.wallet__modalButton} ${styles.wallet__modalButton_danger}`}
                      onClick={handleConfirmRemove}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
              {modalType === "switch" && (
                <>
                  <div className={styles.wallet__modalText}>
                    Switch wallet type for:
                  </div>
                  <div className={styles.wallet__modalWalletInfo}>
                    <div className={styles.wallet__modalWalletName}>
                      {selectedWalletForModal.name}
                    </div>
                    <div className={styles.wallet__modalWalletAddress}>
                      {formatAddress(selectedWalletForModal.address, 8, 8)}
                    </div>
                  </div>
                  <div className={styles.wallet__modalText}>
                    Current type:{" "}
                    <strong>
                      {selectedWalletForModal.isMine
                        ? "My Wallet"
                        : "Other's Wallet"}
                    </strong>
                  </div>
                  <div className={styles.wallet__modalText}>
                    New type:{" "}
                    <strong>
                      {!selectedWalletForModal.isMine
                        ? "My Wallet"
                        : "Other's Wallet"}
                    </strong>
                  </div>
                  <div className={styles.wallet__modalActions}>
                    <button
                      className={styles.wallet__modalButton}
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.wallet__modalButton} ${styles.wallet__modalButton_primary}`}
                      onClick={handleSwitchOwnership}
                    >
                      Switch
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isGuest && wallets.length === 0 && (
        <div className={styles.wallet__loginSection}>
          <button
            className={styles.wallet__telegramButton}
            onClick={loginWithTelegram}
          >
            <span className={styles.wallet__telegramIcon}>📱</span>
            Add random wallets (testing)
          </button>
        </div>
      )}
      {!isGuest && wallets.length > 0 && (
        <div className={styles.wallet__logoutSection}>
          <p className={styles.wallet__logoutMessage}>
            Disconnecting will clear all your wallet data and profile
            information from this session.
          </p>
          <button
            className={styles.wallet__logoutButton}
            onClick={() => {
              // Clear all user data
              clearAllWallets();
              setSubscribedWallets([]); // Clear subscribed wallets too

              // Clear localStorage
              localStorage.removeItem("telegramUserId");

              setToastMessage(
                "Wallet disconnected. Connect a wallet to see your portfolio."
              );
              setShowToast(true);
            }}
          >
            Disconnect Wallets
          </button>
        </div>
      )}
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
