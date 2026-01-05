import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHistory } from "@/services/history.api";
import { formatCurrency, formatTimestamp } from "@/utils/format";
import { useUIStore } from "@/store/uiStore";
import { useWalletStore } from "@/store/walletStore";
import { Card } from "@/components";
import styles from "./History.module.scss";

const timeframes = ["7d", "30d"];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "swap":
      return "🔄";
    case "transfer":
      return "📤";
    case "contract":
      return "📋";
    case "airdrop":
      return "🎁";
    case "staking":
      return "💰";
    case "lending":
      return "🏦";
    case "nft":
      return "🖼️";
    default:
      return "📝";
  }
};

export const History: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d">(
    "7d"
  );
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const showFinancialNumbers = useUIStore(
    (state) => state.showFinancialNumbers
  );
  const { isGuest, selectedWalletAddress, wallets, setSelectedWallet } =
    useWalletStore();

  // Auto-select first wallet if none selected
  useEffect(() => {
    if (!isGuest && !selectedWalletAddress && wallets.length > 0) {
      setSelectedWallet(wallets[0].address);
    }
  }, [isGuest, selectedWalletAddress, wallets, setSelectedWallet]);

  // Map UI timeframe to API timeRange
  const timeRangeMap: { [key: string]: "1d" | "1w" | "1m" | "1y" | "all" } = {
    "7d": "1w",
    "30d": "1m",
  };

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["history", selectedWalletAddress, selectedTimeframe],
    queryFn: () =>
      getHistory(
        selectedWalletAddress || "",
        timeRangeMap[selectedTimeframe] || "1m"
      ),
    enabled: !isGuest && !!selectedWalletAddress, // Don't fetch if guest or no address
  });

  // Filter history by date range
  const filteredHistory = useMemo(() => {
    if (isGuest) return []; // Return empty array for guest mode
    if (!history) return [];
    if (!dateFrom && !dateTo) return history;

    return history.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo + "T23:59:59") : null; // Include full day

      if (fromDate && entryDate < fromDate) return false;
      if (toDate && entryDate > toDate) return false;
      return true;
    });
  }, [history, dateFrom, dateTo, isGuest]);

  const totalGasFee = useMemo(() => {
    if (!filteredHistory) return { eth: 0, usd: 0 };
    return filteredHistory.reduce(
      (acc) => ({
        eth: acc.eth + 0, // Gas fees not provided in current API
        usd: acc.usd + 0,
      }),
      { eth: 0, usd: 0 }
    );
  }, [filteredHistory]);

  // Set default date range based on timeframe
  useEffect(() => {
    const now = new Date();
    const days = selectedTimeframe === "7d" ? 7 : 30;
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - days);

    setDateFrom(fromDate.toISOString().split("T")[0]);
    setDateTo(now.toISOString().split("T")[0]);
  }, [selectedTimeframe]);

  if (isLoading) {
    return <Card>Loading history...</Card>;
  }

  const handleCopyTxHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
  };

  return (
    <div className={styles.history}>
      <Card title="Transaction History" className={styles.history__header}>
        <div className={styles.history__summary}>
          <div className={styles.history__totalGas}>
            <div className={styles.history__totalGasLabel}>Total Gas Fee</div>
            <div className={styles.history__totalGasValue}>
              {showFinancialNumbers
                ? `${totalGasFee.eth.toFixed(6)} ETH (${formatCurrency(
                    totalGasFee.usd,
                    "USD",
                    true
                  )})`
                : "•••• ETH (••••)"}
            </div>
          </div>
          <div className={styles.history__filters}>
            <div className={styles.history__timeframes}>
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  className={`${styles.history__timeframe} ${
                    selectedTimeframe === tf
                      ? styles.history__timeframe_active
                      : ""
                  }`}
                  onClick={() => setSelectedTimeframe(tf as "7d" | "30d")}
                >
                  Past {tf === "7d" ? "7 Days" : "Month"}
                </button>
              ))}
            </div>
            <div className={styles.history__dateFilters}>
              <div className={styles.history__dateFilter}>
                <label className={styles.history__dateLabel}>From</label>
                <input
                  type="date"
                  className={styles.history__dateInput}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className={styles.history__dateFilter}>
                <label className={styles.history__dateLabel}>To</label>
                <input
                  type="date"
                  className={styles.history__dateInput}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className={styles.history__list}>
        {filteredHistory && filteredHistory.length > 0 ? (
          <div className={styles.history__items}>
            {filteredHistory.map((entry) => (
              <div key={entry.id} className={styles.history__item}>
                <div className={styles.history__itemContent}>
                  <div className={styles.history__activity}>
                    <div className={styles.history__activityIcon}>
                      {getActivityIcon(entry.type)}
                    </div>
                    <div className={styles.history__activityInfo}>
                      <div className={styles.history__activityTitle}>
                        {entry.title}
                      </div>
                      <div className={styles.history__activityProtocol}>
                        {entry.description}
                      </div>
                    </div>
                  </div>
                  <div className={styles.history__itemMeta}>
                    <div className={styles.history__metaItem}>
                      <span className={styles.history__detailLabel}>
                        Amount
                      </span>
                      <div className={styles.history__amount}>
                        {showFinancialNumbers
                          ? `${entry.amount?.toFixed(4) || "0"} ${
                              entry.token || ""
                            }`
                          : "•••• •••"}
                      </div>
                    </div>
                    <div className={styles.history__metaItem}>
                      <span className={styles.history__detailLabel}>Time</span>
                      <span className={styles.history__time}>
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.history__itemRight}>
                    <span
                      className={`${styles.history__status} ${
                        styles[`history__status_completed`]
                      }`}
                    >
                      Completed
                    </span>
                    <button
                      className={styles.history__viewButton}
                      onClick={() => handleCopyTxHash(entry.id)}
                      title="Copy transaction hash"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.history__empty}>
            No transaction history found
          </div>
        )}
      </Card>
    </div>
  );
};
