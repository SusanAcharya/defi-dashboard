import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useWalletStore } from "@/store/walletStore";
import { useUIStore } from "@/store/uiStore";
import { formatAddress } from "@/utils/format";
import { fetchUserProfile } from "@/services/user.api";
import { authAPI } from "@/services/auth.api";
import { walletAPI, WalletSubscription } from "@/services/wallet.api";
import { Toast } from "@/components/Toast/Toast";
import { Modal } from "@/components/Modal/Modal";
import logoImage from "@/assets/logo.png";
import walletIcon from "@/assets/icons/wallet.png";
import profileImage from "@/assets/profile.png";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    wallets,
    selectedWalletAddress,
    setSelectedWallet,
    username,
    addWallet,
    updateProfile,
    logout,
    isGuest,
  } = useWalletStore();

  // Add a way to check if store has been hydrated
  const hasHydrated = useWalletStore(
    (state) =>
      // @ts-ignore - checking for _hasHydrated is internal Zustand persist feature
      state._hasHydrated ?? true
  );

  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [subscribedWallets, setSubscribedWallets] = useState<
    WalletSubscription[]
  >([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<
    "idle" | "connecting" | "fetching" | "success" | "error"
  >("idle");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [connectedUsername, setConnectedUsername] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const hasRestoredSession = useRef(false);

  const selectedWallet = selectedWalletAddress
    ? wallets.find((w) => w.address === selectedWalletAddress)
    : null;

  /**
   * Handle wallet connection using @starknet-react/core hooks
   * Follows the reference pattern with proper connector integration
   */
  const handleProfileClick = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      setConnectionStep("connecting");

      // Use the first available connector (Braavos)
      const connector = connectors[0];
      if (!connector) {
        throw new Error("No wallet connectors available");
      }

      // Trigger wallet connection
      await connect({ connector });

      // The address will be available after connection succeeds
      // useAccount hook automatically updates when connection is established
      setConnectionStep("fetching");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect wallet";
      setConnectionError(errorMessage);
      setConnectionStep("error");

      setToastMessage({
        message: `✗ Connection failed: ${errorMessage}`,
        type: "error",
      });

      setIsConnecting(false);
    }
  };

  // Monitor address changes and handle profile fetching
  useEffect(() => {
    if (address && connectionStep === "fetching") {
      const setupProfile = async () => {
        try {
          // Step 1: Onboard wallet to the backend API
          try {
            await authAPI.onboard(address);
          } catch (onboardError) {}

          // Step 2: Fetch user profile data
          const userProfile = await fetchUserProfile(address);
          setConnectedUsername(userProfile.username);

          // Step 3: Update wallet store
          updateProfile(userProfile.username, userProfile.alias);
          const walletName = "Starknet Wallet";
          addWallet(address, walletName, true);

          setConnectionStep("success");
          setShowSuccessModal(true);

          // Show success toast notification
          setToastMessage({
            message: `✓ Connected successfully as ${userProfile.username}`,
            type: "success",
          });

          // Auto-close success modal after 3 seconds and navigate
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate("/profile");
          }, 3000);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch profile";
          setConnectionError(errorMessage);
          setConnectionStep("error");

          setToastMessage({
            message: `✗ Profile fetch failed: ${errorMessage}`,
            type: "error",
          });
        } finally {
          setIsConnecting(false);
        }
      };

      setupProfile();
    }
  }, [address, connectionStep, navigate, addWallet, updateProfile]);

  // Restore persisted login session on component mount (after store hydration)
  useEffect(() => {
    if (
      hasHydrated &&
      !hasRestoredSession.current &&
      !isGuest &&
      wallets.length > 0 &&
      username
    ) {
      hasRestoredSession.current = true;
      setConnectedUsername(username);
      setConnectionStep("success");

      // Auto-select first wallet if none selected
      if (!selectedWalletAddress && wallets.length > 0) {
        setSelectedWallet(wallets[0].address);
      }

      // Show restored session toast (not the full success modal)
      setToastMessage({
        message: `✓ Session restored as ${username}`,
        type: "info",
      });
    }
  }, [
    hasHydrated,
    isGuest,
    wallets,
    username,
    selectedWalletAddress,
    setSelectedWallet,
  ]);

  /**
   * Handle wallet disconnection
   * Clears wallet state and shows confirmation
   */
  const handleDisconnect = async () => {
    try {
      // Call disconnect from @starknet-react/core
      await disconnect();

      // Reset store to logged out state
      logout();

      // Reset local UI state
      setConnectionStep("idle");
      setConnectedUsername(null);
      setConnectionError(null);

      // Show disconnection toast
      setToastMessage({
        message: "✓ Wallet disconnected successfully",
        type: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to disconnect wallet";

      setToastMessage({
        message: `✗ Disconnection failed: ${errorMessage}`,
        type: "error",
      });
    }
  };

  // Load subscribed wallets
  useEffect(() => {
    const loadSubscribedWallets = async () => {
      if (wallets.length === 0) {
        setSubscribedWallets([]);
        return;
      }

      try {
        const mainWallet = wallets[0];
        const subscribed = await walletAPI.getSubscribedWallets(
          mainWallet.address
        );
        setSubscribedWallets(subscribed || []);
      } catch (error) {
        console.error("Error loading subscribed wallets in header:", error);
      }
    };

    loadSubscribedWallets();
  }, [wallets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle wallet dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      // Handle profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    const positionDropdown = () => {
      if (dropdownOpen && buttonRef.current && dropdownMenuRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menu = dropdownMenuRef.current;
        const isMobile = window.innerWidth < 768;

        menu.style.top = `${buttonRect.bottom + 4}px`;

        if (isMobile) {
          menu.style.left = "16px";
          menu.style.right = "16px";
          menu.style.width = "auto";
        } else {
          menu.style.right = `${window.innerWidth - buttonRect.right}px`;
          menu.style.left = "auto";
        }
      }
    };

    if (dropdownOpen) {
      positionDropdown();
      window.addEventListener("resize", positionDropdown);
      window.addEventListener("scroll", positionDropdown, true);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", positionDropdown);
      window.removeEventListener("scroll", positionDropdown, true);
    };
  }, [dropdownOpen, profileDropdownOpen]);

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
          {wallets.length > 0 && (
            <div className={styles.header__walletDropdown} ref={dropdownRef}>
              <button
                ref={buttonRef}
                className={styles.header__walletDropdownButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={styles.header__walletDropdownText}>
                  {selectedWallet ? selectedWallet.name : "ALL"}
                </span>
                <span className={styles.header__walletDropdownIcon}>
                  {dropdownOpen ? "▲" : "▼"}
                </span>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownMenuRef}
                  className={styles.header__walletDropdownMenu}
                >
                  <button
                    className={`${styles.header__walletDropdownItem} ${
                      selectedWalletAddress === null
                        ? styles.header__walletDropdownItem_active
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedWallet(null);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className={styles.header__walletDropdownItemLabel}>
                      ALL
                    </span>
                    <span className={styles.header__walletDropdownItemCount}>
                      ({wallets.length})
                    </span>
                  </button>
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.address}
                      className={`${styles.header__walletDropdownItem} ${
                        selectedWalletAddress === wallet.address
                          ? styles.header__walletDropdownItem_active
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedWallet(wallet.address);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className={styles.header__walletDropdownItemLabel}>
                        {wallet.name}
                      </span>
                      <span
                        className={styles.header__walletDropdownItemAddress}
                      >
                        {formatAddress(wallet.address, 4, 4)}
                      </span>
                      {!wallet.isMine && (
                        <span
                          className={styles.header__walletDropdownItemBadge}
                        >
                          Other
                        </span>
                      )}
                    </button>
                  ))}
                  {subscribedWallets.length > 0 && (
                    <>
                      <div className={styles.header__walletDropdownDivider} />
                      <div className={styles.header__walletDropdownSection}>
                        <span
                          className={styles.header__walletDropdownSectionTitle}
                        >
                          Subscribed Wallets
                        </span>
                      </div>
                      {subscribedWallets.map((subWallet) => (
                        <button
                          key={subWallet.walletAddress}
                          className={`${styles.header__walletDropdownItem} ${
                            selectedWalletAddress === subWallet.walletAddress
                              ? styles.header__walletDropdownItem_active
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedWallet(subWallet.walletAddress);
                            setDropdownOpen(false);
                          }}
                        >
                          <span
                            className={styles.header__walletDropdownItemLabel}
                          >
                            {subWallet.name}
                          </span>
                          <span
                            className={styles.header__walletDropdownItemAddress}
                          >
                            {formatAddress(subWallet.walletAddress, 4, 4)}
                          </span>
                          <span
                            className={styles.header__walletDropdownItemBadge}
                          >
                            Subscribed
                          </span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
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
          <div ref={profileDropdownRef} style={{ position: "relative" }}>
            <button
              ref={profileButtonRef}
              className={`${styles.header__profile} ${
                isConnecting ? styles.header__profile_connecting : ""
              }`}
              onClick={() => {
                if (address) {
                  setProfileDropdownOpen(!profileDropdownOpen);
                } else {
                  handleProfileClick();
                }
              }}
              disabled={isConnecting && !address}
              aria-label="Profile"
              title={
                isConnecting && !address
                  ? `Connecting wallet... (${connectionStep})`
                  : username
              }
            >
              <img
                src={profileImage}
                alt="Profile"
                className={styles.header__avatar}
                style={{ opacity: isConnecting ? 0.6 : 1 }}
              />
              {isConnecting && !address && (
                <span
                  style={{
                    marginLeft: "4px",
                    fontSize: "12px",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                >
                  {connectionStep === "connecting" && "🔗"}
                  {connectionStep === "fetching" && "📥"}
                  {connectionStep === "success" && "✓"}
                  {connectionStep === "error" && "⚠"}
                </span>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {address && profileDropdownOpen && (
              <div
                ref={profileDropdownMenuRef}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  backgroundColor: "#1f2937",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  minWidth: "220px",
                  zIndex: 1000,
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "12px",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Connected Wallet
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#e5e7eb",
                      fontWeight: "600",
                    }}
                  >
                    {address && formatAddress(address, 6, 6)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleDisconnect();
                    setProfileDropdownOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background =
                      "rgba(239, 68, 68, 0.1)";
                    (e.target as HTMLButtonElement).style.color = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background =
                      "transparent";
                    (e.target as HTMLButtonElement).style.color = "#ef4444";
                  }}
                >
                  🔌 Disconnect
                </button>
              </div>
            )}
          </div>
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

      {/* Connection Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/profile");
        }}
        title="✓ Wallet Connected Successfully"
        size="md"
      >
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            🎉
          </div>
          <div
            style={{
              marginBottom: "16px",
              color: "#6B7280",
              wordBreak: "break-word",
            }}
          >
            <p style={{ margin: "8px 0" }}>
              <strong>{connectedUsername}</strong> has been connected to KOMPASS
            </p>
            <p style={{ margin: "8px 0", fontSize: "12px", color: "#9CA3AF" }}>
              {address && formatAddress(address, 4, 4)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "24px",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/profile");
              }}
              style={{
                padding: "12px 24px",
                background: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.background = "#2563EB")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.background = "#3B82F6")
              }
            >
              Go to Profile
            </button>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/portfolio");
              }}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#3B82F6",
                border: "1px solid #3B82F6",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#EFF6FF";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              View Portfolio
            </button>
          </div>
        </div>
      </Modal>

      {/* Connection Error Modal */}
      <Modal
        isOpen={connectionStep === "error"}
        onClose={() => {
          setConnectionStep("idle");
          setConnectionError(null);
        }}
        title="⚠ Connection Failed"
        size="md"
      >
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <div
            style={{
              marginBottom: "16px",
              color: "#6B7280",
              wordBreak: "break-word",
            }}
          >
            <p style={{ margin: "8px 0" }}>
              <strong>Connection Error</strong>
            </p>
            <p style={{ margin: "8px 0", fontSize: "14px", color: "#EF4444" }}>
              {connectionError}
            </p>
          </div>
          <div style={{ marginTop: "24px" }}>
            <button
              onClick={() => {
                setConnectionStep("idle");
                setConnectionError(null);
              }}
              style={{
                padding: "12px 24px",
                background: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.background = "#2563EB")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.background = "#3B82F6")
              }
            >
              Try Again
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          duration={toastMessage.type === "success" ? 3000 : 4000}
          onClose={() => setToastMessage(null)}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </header>
  );
};
