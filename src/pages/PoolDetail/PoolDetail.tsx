import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPoolDetail } from "@/services/poolDetail.api";
import { getPoolTransactions } from "@/services/poolTransactions.api";
import { getPoolChartData } from "@/services/poolChartData.api";
import {
  formatCurrency,
  formatPercentage,
  formatAddress,
  formatTimestamp,
} from "@/utils/format";
import { useUIStore } from "@/store/uiStore";
import { Card, Button } from "@/components";
import styles from "./PoolDetail.module.scss";

const metricTabs = ["TVL", "Volume", "Fee", "APR"];
const timeframes = ["1W", "1M", "1Y"];
const transactionTypes = [
  "All",
  "Buy",
  "Sell",
  "Add Liquidity",
  "Remove Liquidity",
];

export const PoolDetail: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("TVL");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1W");
  const [selectedTransactionType, setSelectedTransactionType] = useState("All");
  const [activeTab, setActiveTab] = useState<"details" | "position">("details");
  const showFinancialNumbers = useUIStore(
    (state) => state.showFinancialNumbers
  );

  const { data: poolDetail, isLoading } = useQuery({
    queryKey: ["pool-detail", poolId],
    queryFn: () => getPoolDetail(poolId || ""),
    enabled: !!poolId,
  });

  const { data: transactions } = useQuery({
    queryKey: ["pool-transactions", poolId, selectedTransactionType],
    queryFn: () =>
      getPoolTransactions(
        poolId || "",
        selectedTransactionType === "All"
          ? undefined
          : selectedTransactionType.toLowerCase().replace(" ", "-")
      ),
    enabled: !!poolId,
  });

  const { data: chartData } = useQuery({
    queryKey: [
      "pool-chart",
      poolId,
      selectedMetric.toLowerCase(),
      selectedTimeframe.toLowerCase(),
    ],
    queryFn: () =>
      getPoolChartData(
        poolId || "",
        selectedMetric.toLowerCase() as "tvl" | "volume" | "fee" | "apr",
        selectedTimeframe.toLowerCase() as "1w" | "1m" | "1y"
      ),
    enabled: !!poolId,
  });

  if (isLoading) {
    return <Card>Loading pool details...</Card>;
  }

  if (!poolDetail) {
    return <Card>Pool not found</Card>;
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className={styles.poolDetail}>
      {/* Header */}
      <div className={styles.poolDetail__header}>
        <button
          className={styles.poolDetail__back}
          onClick={() => navigate("/explore")}
        >
          ← Back
        </button>
        <div className={styles.poolDetail__titleRow}>
          <div className={styles.poolDetail__pair}>{poolDetail.pair}</div>
          <div className={styles.poolDetail__headerActions}>
            <span className={styles.poolDetail__fee}>{poolDetail.fee}</span>
            <span className={styles.poolDetail__star}>⭐</span>
            <button className={styles.poolDetail__notification}>🔔</button>
            <button className={styles.poolDetail__chart}>📊</button>
          </div>
        </div>
      </div>

      <div className={styles.poolDetail__content}>
        {/* Left Panel */}
        <div className={styles.poolDetail__left}>
          {/* Chart Section */}
          <Card className={styles.poolDetail__chartCard}>
            <div className={styles.poolDetail__chartHeader}>
              <div className={styles.poolDetail__metricTabs}>
                {metricTabs.map((metric) => (
                  <button
                    key={metric}
                    className={`${styles.poolDetail__metricTab} ${
                      selectedMetric === metric
                        ? styles.poolDetail__metricTab_active
                        : ""
                    }`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    {metric}
                  </button>
                ))}
              </div>
              <div className={styles.poolDetail__timeframes}>
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    className={`${styles.poolDetail__timeframe} ${
                      selectedTimeframe === tf
                        ? styles.poolDetail__timeframe_active
                        : ""
                    }`}
                    onClick={() => setSelectedTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.poolDetail__chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3c78d8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3c78d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(60, 120, 200, 0.2)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#3c78d8"
                    style={{ fontSize: "12px" }}
                    tick={{ fill: "#b0b0c0" }}
                  />
                  <YAxis
                    stroke="#3c78d8"
                    style={{ fontSize: "12px" }}
                    tick={{ fill: "#b0b0c0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(26, 26, 26, 0.95)",
                      border: "1px solid rgba(60, 120, 200, 0.5)",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    itemStyle={{ color: "#ffffff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric.toLowerCase()}
                    fill="url(#areaGradient)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric.toLowerCase()}
                    stroke="#3c78d8"
                    strokeWidth={3}
                    dot={{ fill: "#3c78d8", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Transactions Section */}
          <Card
            title="Transactions"
            className={styles.poolDetail__transactionsCard}
          >
            <div className={styles.poolDetail__transactionFilters}>
              {transactionTypes.map((type) => (
                <button
                  key={type}
                  className={`${styles.poolDetail__transactionFilter} ${
                    selectedTransactionType === type
                      ? styles.poolDetail__transactionFilter_active
                      : ""
                  }`}
                  onClick={() => setSelectedTransactionType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className={styles.poolDetail__tableWrapper}>
              <table className={styles.poolDetail__table}>
                <thead>
                  <tr>
                    <th>Trade</th>
                    <th>Type</th>
                    <th>USD Value</th>
                    <th>Time</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        {tx.amountIn} {tx.tokenIn} → {tx.amountOut}{" "}
                        {tx.tokenOut}
                      </td>
                      <td>
                        <span
                          className={`${styles.poolDetail__txType} ${
                            styles[`poolDetail__txType_${tx.type}`]
                          }`}
                        >
                          {tx.type
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </td>
                      <td>
                        {formatCurrency(
                          tx.usdValue,
                          "USD",
                          showFinancialNumbers
                        )}
                      </td>
                      <td>{formatTimestamp(tx.timestamp)}</td>
                      <td>
                        <button
                          className={styles.poolDetail__address}
                          onClick={() => handleCopyAddress(tx.address)}
                          title={tx.address}
                        >
                          {formatAddress(tx.address, 4, 4)}
                        </button>
                      </td>
                      <td>
                        <button className={styles.poolDetail__action}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className={styles.poolDetail__right}>
          <Card className={styles.poolDetail__sidebarCard}>
            <div className={styles.poolDetail__sidebarTabs}>
              <button
                className={`${styles.poolDetail__sidebarTab} ${
                  activeTab === "details"
                    ? styles.poolDetail__sidebarTab_active
                    : ""
                }`}
                onClick={() => setActiveTab("details")}
              >
                Pool details
              </button>
              <button
                className={`${styles.poolDetail__sidebarTab} ${
                  activeTab === "position"
                    ? styles.poolDetail__sidebarTab_active
                    : ""
                }`}
                onClick={() => setActiveTab("position")}
              >
                My position
              </button>
            </div>

            {activeTab === "details" && (
              <div className={styles.poolDetail__details}>
                <div className={styles.poolDetail__stat}>
                  <div className={styles.poolDetail__statLabel}>TVL</div>
                  <div className={styles.poolDetail__statValue}>
                    {formatCurrency(
                      poolDetail.tvl,
                      "USD",
                      showFinancialNumbers
                    )}
                  </div>
                  <div
                    className={`${styles.poolDetail__statChange} ${
                      poolDetail.tvlChange24h >= 0
                        ? styles.poolDetail__statChange_positive
                        : styles.poolDetail__statChange_negative
                    }`}
                  >
                    {formatPercentage(
                      poolDetail.tvlChange24h,
                      2,
                      showFinancialNumbers
                    )}
                  </div>
                </div>

                <div className={styles.poolDetail__stat}>
                  <div className={styles.poolDetail__statLabel}>24h Volume</div>
                  <div className={styles.poolDetail__statValue}>
                    {formatCurrency(
                      poolDetail.volume24h,
                      "USD",
                      showFinancialNumbers
                    )}
                  </div>
                  <div
                    className={`${styles.poolDetail__statChange} ${
                      poolDetail.volumeChange24h >= 0
                        ? styles.poolDetail__statChange_positive
                        : styles.poolDetail__statChange_negative
                    }`}
                  >
                    {formatPercentage(
                      poolDetail.volumeChange24h,
                      2,
                      showFinancialNumbers
                    )}
                  </div>
                </div>

                <div className={styles.poolDetail__stat}>
                  <div className={styles.poolDetail__statLabel}>24h Fees</div>
                  <div className={styles.poolDetail__statValue}>
                    {formatCurrency(
                      poolDetail.fee24h,
                      "USD",
                      showFinancialNumbers
                    )}
                  </div>
                  <div
                    className={`${styles.poolDetail__statChange} ${
                      poolDetail.feeChange24h >= 0
                        ? styles.poolDetail__statChange_positive
                        : styles.poolDetail__statChange_negative
                    }`}
                  >
                    {formatPercentage(
                      poolDetail.feeChange24h,
                      2,
                      showFinancialNumbers
                    )}
                  </div>
                </div>

                <div className={styles.poolDetail__stat}>
                  <div className={styles.poolDetail__statLabel}>24h APR</div>
                  <div className={styles.poolDetail__statValue}>
                    {formatPercentage(
                      poolDetail.apr24h,
                      2,
                      showFinancialNumbers
                    )}
                  </div>
                  <div
                    className={`${styles.poolDetail__statChange} ${
                      poolDetail.aprChange24h >= 0
                        ? styles.poolDetail__statChange_positive
                        : styles.poolDetail__statChange_negative
                    }`}
                  >
                    {poolDetail.aprChange24h >= 0 ? "↑" : "↓"}{" "}
                    {formatPercentage(
                      Math.abs(poolDetail.aprChange24h),
                      2,
                      showFinancialNumbers
                    )}
                  </div>
                </div>

                <div className={styles.poolDetail__info}>
                  <div className={styles.poolDetail__infoLabel}>
                    Pool Address
                  </div>
                  <div className={styles.poolDetail__infoValue}>
                    {formatAddress(poolDetail.poolAddress, 4, 4)}
                    <button
                      className={styles.poolDetail__copy}
                      onClick={() => handleCopyAddress(poolDetail.poolAddress)}
                      title="Copy address"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div className={styles.poolDetail__info}>
                  <div className={styles.poolDetail__infoLabel}>Pool Type</div>
                  <div className={styles.poolDetail__infoValue}>
                    {poolDetail.poolType}
                  </div>
                </div>

                <div className={styles.poolDetail__info}>
                  <div className={styles.poolDetail__infoLabel}>
                    Current Price
                  </div>
                  <div className={styles.poolDetail__infoValue}>
                    {poolDetail.currentPrice}
                  </div>
                </div>

                <div className={styles.poolDetail__info}>
                  <div className={styles.poolDetail__infoLabel}>Platform</div>
                  <div className={styles.poolDetail__infoValue}>
                    {poolDetail.protocol}
                  </div>
                </div>

                {/* LP Breakdown */}
                <div className={styles.poolDetail__lpBreakdown}>
                  <div className={styles.poolDetail__lpTitle}>LP Breakdown</div>
                  <div className={styles.poolDetail__lpBar}>
                    {poolDetail.lpBreakdown.map((asset, index) => (
                      <div
                        key={asset.asset}
                        className={styles.poolDetail__lpBarSegment}
                        style={{
                          width: `${asset.percentage}%`,
                          backgroundColor: index === 0 ? "#5a9fff" : "#3c78d8",
                        }}
                      />
                    ))}
                  </div>
                  <div className={styles.poolDetail__lpTable}>
                    {poolDetail.lpBreakdown.map((asset) => (
                      <div
                        key={asset.asset}
                        className={styles.poolDetail__lpRow}
                      >
                        <div className={styles.poolDetail__lpAsset}>
                          {asset.asset}
                        </div>
                        <div className={styles.poolDetail__lpAmount}>
                          {formatCurrency(
                            asset.coinAmount / 1000000,
                            "USD",
                            showFinancialNumbers
                          )}
                          M
                        </div>
                        <div className={styles.poolDetail__lpValue}>
                          {formatCurrency(
                            asset.value / 1000000,
                            "USD",
                            showFinancialNumbers
                          )}
                          M
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "position" && (
              <div className={styles.poolDetail__position}>
                <div className={styles.poolDetail__noPosition}>
                  <p>You don't have a position in this pool.</p>
                  <Button variant="primary">Add Liquidity</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
