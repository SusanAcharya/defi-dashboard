import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDefiPositions } from "@/utils/api";
import { useWalletStore } from "@/store/walletStore";
import { Card } from "../Card/Card";
import styles from "./PortfolioExposure.module.scss";

export const PortfolioExposure: React.FC = () => {
  const { selectedWalletAddress, isGuest, wallets } = useWalletStore();

  // Determine if we have a valid wallet to fetch data for
  const hasWallet = wallets.length > 0;
  const walletToFetch =
    selectedWalletAddress || (hasWallet ? wallets[0].address : null);

  // Get DeFi positions for selected wallet or combined
  const { data: defiPositions, isLoading } = useQuery({
    queryKey: ["defiPositions", walletToFetch],
    queryFn: () => getDefiPositions(walletToFetch),
    enabled: !isGuest && hasWallet, // Only fetch if not guest AND has wallet
  });

  // Convert DeFi positions to exposure data
  const data =
    isGuest || !hasWallet
      ? [
          { name: "Please", value: 33.33, color: "#3c78d8" },
          { name: "Add", value: 33.33, color: "#5a9fff" },
          { name: "Wallet", value: 33.34, color: "#ff9500" },
        ]
      : defiPositions?.map((pos, index) => {
          const colors = [
            "#3c78d8",
            "#5a9fff",
            "#ff9500",
            "#ff7f00",
            "#228b22",
            "#ff6347",
          ];
          return {
            name: pos.protocol,
            value: pos.positionValue,
            color: colors[index % colors.length],
          };
        }) || [];

  // Show loading placeholder if fetching
  const showLoading = !isGuest && hasWallet && isLoading && !defiPositions;

  // Only show first 5 items
  const displayData = showLoading
    ? [
        { name: "Loading", value: 25, color: "#3c78d8" },
        { name: "Protocol", value: 25, color: "#5a9fff" },
        { name: "Data", value: 25, color: "#ff9500" },
        { name: "...", value: 25, color: "#ff7f00" },
      ]
    : data.slice(0, 5);
  const totalValue = displayData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card title="PROTOCOL EXPOSURE" className={styles.portfolioExposure}>
      <div className={styles.portfolioExposure__header}>
        <span className={styles.portfolioExposure__trend}>+18.5% (30D)</span>
      </div>
      <div className={styles.portfolioExposure__list}>
        {displayData.map((item, index) => {
          const percentage =
            totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          return (
            <div key={index} className={styles.portfolioExposure__item}>
              <div className={styles.portfolioExposure__itemIcon}>
                {item.name[0]}
              </div>
              <div className={styles.portfolioExposure__itemInfo}>
                <div className={styles.portfolioExposure__itemName}>
                  {item.name || ""}
                </div>
                <div className={styles.portfolioExposure__itemValue}>
                  {isGuest || !hasWallet
                    ? `${item.value.toFixed(2)}%`
                    : showLoading
                    ? "..."
                    : `$${item.value.toLocaleString()}`}
                </div>
              </div>
              <div className={styles.portfolioExposure__itemAllocation}>
                <div className={styles.portfolioExposure__itemBar}>
                  <div
                    className={styles.portfolioExposure__itemBarFill}
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 50%, ${item.color} 100%)`,
                    }}
                  />
                </div>
                <div className={styles.portfolioExposure__itemPercentage}>
                  {percentage < 0.01 ? "<0.01%" : `${percentage.toFixed(2)}%`}
                </div>
              </div>
              <button className={styles.portfolioExposure__itemMenu}>⋮</button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
