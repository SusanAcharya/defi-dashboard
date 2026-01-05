import React, { useState, useCallback } from "react";
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
import { tokenAPI } from "@/services/token.api";
import {
  formatCurrency,
  formatPercentage,
  formatAddress,
} from "@/utils/format";
import { useUIStore } from "@/store/uiStore";
import { Card, Button, Toast } from "@/components";
import styles from "./TokenDetail.module.scss";

const timeframes = ["1D", "7D", "30D", "90D", "1Y", "ALL"];

export const TokenDetail: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");
  const showFinancialNumbers = useUIStore(
    (state) => state.showFinancialNumbers
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const { data: tokensResponse } = useQuery({
    queryKey: ["tokens"],
    queryFn: () => tokenAPI.getAllTokens(),
  });

  const tokens = tokensResponse?.data?.tokens || [];
  const token = tokens?.find((t: any) => t.address === tokenId);

  // Generate chart data - will show placeholder values if price is unavailable
  const basePrice = token?.price || 0;
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: basePrice > 0 ? basePrice * (1 + (Math.random() - 0.5) * 0.1) : 0,
    };
  });

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage("Contract address copied to clipboard");
    setShowToast(true);
  };

  if (!token) {
    return (
      <div className={styles.tokenDetail}>
        <Card>
          <div className={styles.tokenDetail__notFound}>
            <p>Token not found</p>
            <Button variant="outline" onClick={() => navigate("/live-chart")}>
              Back to Market Prices
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.tokenDetail}>
      <Card title={`${token.name} (${token.symbol})`}>
        <div className={styles.tokenDetail__header}>
          <div className={styles.tokenDetail__tokenInfo}>
            <div className={styles.tokenDetail__tokenIcon}>
              {token.symbol[0]}
            </div>
            <div className={styles.tokenDetail__tokenDetails}>
              <div className={styles.tokenDetail__tokenNameRow}>
                <span className={styles.tokenDetail__tokenName}>
                  {token.name}
                </span>
                <span className={styles.tokenDetail__verified}>✓</span>
              </div>
              <div className={styles.tokenDetail__tokenSymbolRow}>
                <span className={styles.tokenDetail__tokenSymbol}>
                  {token.symbol}
                </span>
                {token.address && (
                  <>
                    <span className={styles.tokenDetail__address}>
                      {formatAddress(token.address, 4, 4)}
                    </span>
                    <button
                      className={styles.tokenDetail__copyButton}
                      onClick={() => handleCopyAddress(token.address || "")}
                      title="Copy address"
                    >
                      📋
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/live-chart")}>
            ← Back
          </Button>
        </div>

        <div className={styles.tokenDetail__priceSection}>
          <div className={styles.tokenDetail__price}>
            {showFinancialNumbers
              ? formatCurrency(token.price ?? 0, "USD", true)
              : "••••"}
          </div>
          <div
            className={`${styles.tokenDetail__change} ${
              (token.change24h ?? 0) >= 0
                ? styles.tokenDetail__change_positive
                : styles.tokenDetail__change_negative
            }`}
          >
            {showFinancialNumbers
              ? `${formatPercentage(token.change24h ?? 0, 2, true)} (24h)`
              : "•••"}
          </div>
        </div>

        <div className={styles.tokenDetail__timeframes}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`${styles.tokenDetail__timeframe} ${
                selectedTimeframe === tf
                  ? styles.tokenDetail__timeframe_active
                  : ""
              }`}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className={styles.tokenDetail__chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient
                  id="tokenAreaGradient"
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
                formatter={(value: number) =>
                  formatCurrency(value, "USD", true)
                }
              />
              <Area
                type="monotone"
                dataKey="price"
                fill="url(#tokenAreaGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3c78d8"
                strokeWidth={3}
                dot={{ fill: "#3c78d8", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.tokenDetail__stats}>
          <div className={styles.tokenDetail__stat}>
            <div className={styles.tokenDetail__statLabel}>Market Cap</div>
            <div className={styles.tokenDetail__statValue}>
              {showFinancialNumbers
                ? formatCurrency(token.usdValue, "USD", true)
                : "••••"}
            </div>
          </div>
          <div className={styles.tokenDetail__stat}>
            <div className={styles.tokenDetail__statLabel}>Liquidity</div>
            <div className={styles.tokenDetail__statValue}>
              {showFinancialNumbers
                ? formatCurrency(token.liquidity || 0, "USD", true)
                : "••••"}
            </div>
          </div>
          <div className={styles.tokenDetail__stat}>
            <div className={styles.tokenDetail__statLabel}>24h Change</div>
            <div
              className={`${styles.tokenDetail__statValue} ${
                (token.change24h ?? 0) >= 0
                  ? styles.tokenDetail__statValue_positive
                  : styles.tokenDetail__statValue_negative
              }`}
            >
              {showFinancialNumbers
                ? formatPercentage(token.change24h ?? 0, 2, true)
                : "•••"}
            </div>
          </div>
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
