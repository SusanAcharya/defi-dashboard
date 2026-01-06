import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getPortfolio,
  getPortfolioForAllWallets,
} from "@/services/portfolio.api";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { useUIStore } from "@/store/uiStore";
import { useWalletStore } from "@/store/walletStore";
import { Card } from "../Card/Card";
import showIcon from "@/assets/icons/show.png";
import hideIcon from "@/assets/icons/hide.png";
import styles from "./PortfolioCard.module.scss";

export const PortfolioCard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedWalletAddress, isGuest, alias, wallets } = useWalletStore();

  // Determine if we're showing all wallets or a single wallet
  const isShowingAllWallets =
    selectedWalletAddress === null && wallets.length > 0;
  const walletsToFetch = isShowingAllWallets
    ? wallets.map((w) => w.address)
    : selectedWalletAddress
    ? [selectedWalletAddress]
    : [];

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ["portfolio", selectedWalletAddress, isShowingAllWallets],
    queryFn: async () => {
      console.log("Fetching portfolio for wallets:", walletsToFetch);
      if (walletsToFetch.length === 0) {
        throw new Error("No wallets to fetch");
      }

      if (isShowingAllWallets) {
        return getPortfolioForAllWallets(walletsToFetch);
      } else if (selectedWalletAddress) {
        return getPortfolio(selectedWalletAddress);
      }

      throw new Error("Invalid wallet selection");
    },
    enabled: !isGuest && walletsToFetch.length > 0,
  });

  const showFinancialNumbers = useUIStore(
    (state) => state.showFinancialNumbers
  );
  const toggleFinancialNumbers = useUIStore(
    (state) => state.toggleFinancialNumbers
  );

  // Guest mode: return zero portfolio
  const guestPortfolio = {
    totalValue: 0,
    pnl24h: 0,
    totalAssets: 0,
    totalDebt: 0,
    nftValue: 0,
    protocolRewards: 0,
    pnl24hPercent: 0,
  };

  // Use guest portfolio as fallback if no data is available
  const displayPortfolio = portfolio || guestPortfolio;

  if (isLoading && !isGuest) {
    return <Card className={styles.portfolioCard}>Loading...</Card>;
  }

  return (
    <Card className={styles.portfolioCard}>
      <div className={styles.portfolioCard__topRow}>
        {alias && (
          <div className={styles.portfolioCard__alias}>Alias: {alias}</div>
        )}
      </div>

      {/* Desktop Layout: Top Section with Net Worth and Protocol Rewards */}
      <div className={styles.portfolioCard__topSection}>
        <div className={styles.portfolioCard__topLeft}>
          <div className={styles.portfolioCard__networthHeader}>
            <div className={styles.portfolioCard__label}>TOTAL NET WORTH</div>
            {!isGuest && (
              <button
                className={styles.portfolioCard__eyeButton}
                onClick={toggleFinancialNumbers}
                aria-label={
                  showFinancialNumbers ? "Hide numbers" : "Show numbers"
                }
              >
                <img
                  src={showFinancialNumbers ? showIcon : hideIcon}
                  alt={showFinancialNumbers ? "Hide numbers" : "Show numbers"}
                  className={styles.portfolioCard__eyeIcon}
                />
              </button>
            )}
          </div>
          <div className={styles.portfolioCard__networthValue}>
            {isLoading && !isGuest ? (
              <span style={{ color: "#9ca3af" }}>Loading...</span>
            ) : (
              formatCurrency(
                displayPortfolio?.totalValue,
                "USD",
                showFinancialNumbers
              )
            )}
          </div>
          <div className={styles.portfolioCard__profitLoss}>
            <div className={styles.portfolioCard__profitLossLabel}>
              PROFIT/LOSS (24H)
            </div>
            <div
              className={`${styles.portfolioCard__profitLossValue} ${
                (displayPortfolio?.pnl24hPercent || 0) >= 0
                  ? styles.portfolioCard__profitLossValue_positive
                  : styles.portfolioCard__profitLossValue_negative
              }`}
            >
              {isLoading && !isGuest ? (
                <span style={{ color: "#9ca3af" }}>--</span>
              ) : showFinancialNumbers ? (
                formatPercentage(
                  displayPortfolio?.pnl24hPercent || 0,
                  2,
                  showFinancialNumbers
                )
              ) : (
                "•••"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Metrics section - only show when not guest */}
      <div className={styles.portfolioCard__desktopMetrics}>
        {!isGuest ? (
          <>
            <div className={styles.portfolioCard__divider} />
            <div className={styles.portfolioCard__metrics}>
              <div className={styles.portfolioCard__metric}>
                <div className={styles.portfolioCard__metricLabel}>
                  TOTAL DEBT
                </div>
                <div className={styles.portfolioCard__metricValue}>
                  {formatCurrency(
                    displayPortfolio.totalDebt,
                    "USD",
                    showFinancialNumbers
                  )}
                </div>
              </div>
              <div className={styles.portfolioCard__metric}>
                <div className={styles.portfolioCard__metricLabel}>
                  PROTOCOL REWARDS
                </div>
                <div className={styles.portfolioCard__metricValue}>
                  {formatCurrency(
                    displayPortfolio.protocolRewards,
                    "USD",
                    showFinancialNumbers
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.portfolioCard__addWalletSectionDesktop}>
            <button
              className={styles.portfolioCard__addWalletButton}
              onClick={() => navigate("/wallet")}
            >
              Add a Wallet to start Tracking
            </button>
          </div>
        )}
      </div>

      {/* Mobile: Metrics section - only show when not guest */}
      {!isGuest && (
        <div className={styles.portfolioCard__mobileMetrics}>
          <div className={styles.portfolioCard__divider} />
          <div className={styles.portfolioCard__metrics}>
            <div className={styles.portfolioCard__metric}>
              <div className={styles.portfolioCard__metricLabel}>
                TOTAL DEBT
              </div>
              <div className={styles.portfolioCard__metricValue}>
                {formatCurrency(
                  displayPortfolio.totalDebt,
                  "USD",
                  showFinancialNumbers
                )}
              </div>
            </div>
            <div className={styles.portfolioCard__metric}>
              <div className={styles.portfolioCard__metricLabel}>
                PROTOCOL REWARDS
              </div>
              <div className={styles.portfolioCard__metricValue}>
                {formatCurrency(
                  displayPortfolio.protocolRewards,
                  "USD",
                  showFinancialNumbers
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
