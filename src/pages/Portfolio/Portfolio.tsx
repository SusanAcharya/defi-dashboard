import React, { useState, useMemo, useRef, useCallback } from "react";
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
import { getPortfolio, getPortfolioChartData } from "@/services/portfolio.api";
import { getDefiPositions } from "@/services/defiPosition.api";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { useUIStore } from "@/store/uiStore";
import { useWalletStore } from "@/store/walletStore";
import { Card } from "@/components";
import { walletAPI } from "@/services/wallet.api";
import styles from "./Portfolio.module.scss";

const timeframes = ["1W", "1M", "6M", "1Y", "ALL"];

export const Portfolio: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const showFinancialNumbers = useUIStore(
    (state) => state.showFinancialNumbers
  );
  const { selectedWalletAddress, isGuest } = useWalletStore();
  // Show all wallets, not just "my wallets"

  // Guest mode: return zero portfolio
  const guestPortfolio = {
    totalValue: 0,
    pnl24hPercent: 0,
  };

  // Get portfolio data for selected wallet or combined
  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", selectedWalletAddress],
    queryFn: ({ queryKey }) => getPortfolio(queryKey[1] as string | null),
    enabled: !isGuest, // Don't fetch if guest
  });

  const displayPortfolio = isGuest ? guestPortfolio : portfolio;

  // Get chart data
  const { data: chartData } = useQuery({
    queryKey: ["portfolioChart", selectedWalletAddress, selectedTimeframe],
    queryFn: ({ queryKey }) =>
      getPortfolioChartData(
        queryKey[1] as string | null,
        queryKey[2] as string
      ),
    enabled: !isGuest, // Don't fetch if guest
  });

  // Get tokens for selected wallet or combined
  // Note: This will fetch from /wallet/:address endpoint which includes token balances
  const { data: tokens, isLoading } = useQuery({
    queryKey: ["tokens", selectedWalletAddress],
    queryFn: async () => {
      if (!selectedWalletAddress || isGuest) return [];
      try {
        return await walletAPI.getWalletTokens(selectedWalletAddress);
      } catch {
        return [];
      }
    },
    enabled: !isGuest && !!selectedWalletAddress, // Don't fetch if guest or no address
  });

  // Get DeFi positions from API
  const { data: defiPositions = [] } = useQuery<any[]>({
    queryKey: ["defiPositions", selectedWalletAddress],
    queryFn: () => getDefiPositions(selectedWalletAddress),
    enabled: !isGuest && !!selectedWalletAddress,
  });

  // Determine if we should enable zoom (for larger timelines)
  const enableZoom = useMemo(() => {
    return (
      selectedTimeframe === "90D" ||
      selectedTimeframe === "1Y" ||
      selectedTimeframe === "ALL"
    );
  }, [selectedTimeframe]);

  // Calculate visible data range based on zoom and pan
  const visibleData = useMemo(() => {
    if (!chartData || chartData.length === 0 || !enableZoom) {
      return chartData || [];
    }

    const totalPoints = chartData.length;
    const visiblePoints = Math.max(10, Math.floor(totalPoints / zoomLevel));
    const maxOffset = Math.max(0, totalPoints - visiblePoints);
    const clampedOffset = Math.min(maxOffset, Math.max(0, panOffset));

    const startIndex = Math.floor(clampedOffset);
    const endIndex = Math.min(startIndex + visiblePoints, totalPoints);

    return chartData.slice(startIndex, endIndex);
  }, [chartData, zoomLevel, panOffset, enableZoom]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!enableZoom || !chartData || chartData.length === 0) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out or in
      const newZoomLevel = Math.max(1, Math.min(10, zoomLevel * delta));

      // Adjust pan offset to zoom towards mouse position
      const rect = chartContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const relativeX = mouseX / rect.width;
        const totalPoints = chartData.length;
        const visiblePoints = Math.max(
          10,
          Math.floor(totalPoints / newZoomLevel)
        );
        const targetPoint = Math.floor(
          panOffset + relativeX * (totalPoints / zoomLevel)
        );
        const newOffset = Math.max(
          0,
          Math.min(
            totalPoints - visiblePoints,
            targetPoint - relativeX * visiblePoints
          )
        );

        setPanOffset(newOffset);
      }

      setZoomLevel(newZoomLevel);
    },
    [enableZoom, chartData, zoomLevel, panOffset]
  );

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableZoom) return;
      isDraggingRef.current = true;
      dragStartRef.current = e.clientX;
      e.preventDefault();
    },
    [enableZoom]
  );

  // Handle mouse move for panning
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        !enableZoom ||
        !isDraggingRef.current ||
        !chartData ||
        chartData.length === 0
      )
        return;

      const deltaX = e.clientX - dragStartRef.current;
      const rect = chartContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const totalPoints = chartData.length;
        const visiblePoints = Math.max(10, Math.floor(totalPoints / zoomLevel));
        const maxOffset = Math.max(0, totalPoints - visiblePoints);
        const panDelta = (deltaX / rect.width) * (totalPoints / zoomLevel);
        const newOffset = Math.max(
          0,
          Math.min(maxOffset, panOffset - panDelta)
        );
        setPanOffset(newOffset);
        dragStartRef.current = e.clientX;
      }
    },
    [enableZoom, chartData, zoomLevel, panOffset]
  );

  // Handle mouse up for panning
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Reset zoom/pan when timeframe changes
  React.useEffect(() => {
    setZoomLevel(1);
    setPanOffset(0);
  }, [selectedTimeframe]);

  return (
    <div className={styles.portfolio}>
      <Card title="VIGOR TRENDS (Historical PPL)">
        <div className={styles.portfolio__header}>
          <div>
            <div className={styles.portfolio__value}>
              {displayPortfolio &&
                formatCurrency(
                  displayPortfolio.totalValue,
                  "USD",
                  showFinancialNumbers
                )}
            </div>
            {displayPortfolio && (
              <div className={styles.portfolio__change}>
                {formatPercentage(
                  displayPortfolio.pnl24hPercent,
                  2,
                  showFinancialNumbers
                )}{" "}
                (24h)
              </div>
            )}
          </div>
        </div>
        <div className={styles.portfolio__timeframes}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`${styles.portfolio__timeframe} ${
                selectedTimeframe === tf
                  ? styles.portfolio__timeframe_active
                  : ""
              }`}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        {!chartData || chartData.length === 0 ? (
          <div className={styles.portfolio__empty}>
            <div>No graph data available for this timeframe</div>
            <div
              style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.7 }}
            >
              Historical portfolio data will appear here as transactions are
              recorded
            </div>
          </div>
        ) : (
          <div
            ref={chartContainerRef}
            className={`${styles.portfolio__chart} ${
              enableZoom ? styles.portfolio__chart_zoomable : ""
            }`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {enableZoom && (
              <div className={styles.portfolio__zoomHint}>
                Scroll to zoom • Drag to pan
              </div>
            )}
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={visibleData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="portfolioAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3c78d8" stopOpacity={0.6} />
                    <stop offset="30%" stopColor="#5a9fff" stopOpacity={0.4} />
                    <stop offset="70%" stopColor="#3c78d8" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3c78d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="portfolioLineGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#5a9fff" stopOpacity={1} />
                    <stop offset="50%" stopColor="#3c78d8" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#5a9fff" stopOpacity={1} />
                  </linearGradient>
                  <filter id="portfolioLineGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 4"
                  stroke="rgba(60, 120, 200, 0.15)"
                  vertical={false}
                  horizontal={true}
                  strokeWidth={0.5}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(60, 120, 200, 0.4)"
                  tick={{
                    fill: "rgba(255, 255, 255, 0.6)",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  tickLine={{
                    stroke: "rgba(60, 120, 200, 0.3)",
                    strokeWidth: 1,
                  }}
                  axisLine={{
                    stroke: "rgba(60, 120, 200, 0.3)",
                    strokeWidth: 1,
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="rgba(60, 120, 200, 0.4)"
                  tick={{
                    fill: "rgba(255, 255, 255, 0.6)",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  tickLine={{
                    stroke: "rgba(60, 120, 200, 0.3)",
                    strokeWidth: 1,
                  }}
                  axisLine={{
                    stroke: "rgba(60, 120, 200, 0.3)",
                    strokeWidth: 1,
                  }}
                  tickFormatter={(value) => {
                    if (value >= 1000000)
                      return `$${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
                    return `$${value}`;
                  }}
                  width={70}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value as number;
                      return (
                        <div className={styles.portfolio__tooltip}>
                          <div className={styles.portfolio__tooltipLabel}>
                            {label}
                          </div>
                          <div className={styles.portfolio__tooltipValue}>
                            {formatCurrency(value, "USD", true)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{
                    stroke: "#5a9fff",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 4",
                    opacity: 0.8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="url(#portfolioAreaGradient)"
                  stroke="none"
                  isAnimationActive={true}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#portfolioLineGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#5a9fff",
                    stroke: "#ffffff",
                    strokeWidth: 2.5,
                    style: {
                      filter: "drop-shadow(0 0 6px rgba(90, 150, 240, 0.9))",
                      transition: "all 0.2s ease",
                    },
                  }}
                  filter="url(#portfolioLineGlow)"
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card title="Token Holdings">
        {isLoading && !isGuest ? (
          <div>Loading tokens...</div>
        ) : isGuest || !tokens || tokens.length === 0 ? (
          <div className={styles.portfolio__empty}>No token holdings</div>
        ) : (
          <div className={styles.portfolio__tableWrapper}>
            <table className={styles.portfolio__table}>
              <thead>
                <tr className={styles.portfolio__tableHeader}>
                  <th>Token</th>
                  <th>Balance</th>
                  <th>Value</th>
                  <th>24h Change</th>
                </tr>
              </thead>
              <tbody>
                {tokens?.map((token: any) => (
                  <tr key={token.id} className={styles.portfolio__tableRow}>
                    <td>
                      <div className={styles.portfolio__tokenInfo}>
                        <div className={styles.portfolio__tokenSymbol}>
                          {token.symbol || "—"}
                        </div>
                        <div className={styles.portfolio__tokenName}>
                          {token.name || "—"}
                        </div>
                      </div>
                    </td>
                    <td className={styles.portfolio__tokenBalance}>
                      {token.balance ?? "0"}
                    </td>
                    <td className={styles.portfolio__tokenValue}>
                      {formatCurrency(
                        token.usdValue ?? 0,
                        "USD",
                        showFinancialNumbers
                      )}
                    </td>
                    <td
                      className={`${styles.portfolio__tokenChange} ${
                        (token.change24h ?? 0) >= 0
                          ? styles.portfolio__tokenChange_positive
                          : styles.portfolio__tokenChange_negative
                      }`}
                    >
                      {formatPercentage(
                        token.change24h ?? 0,
                        2,
                        showFinancialNumbers
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!isGuest && defiPositions && defiPositions.length > 0 && (
        <Card title="Protocol Positions">
          <div className={styles.portfolio__tableWrapper}>
            <table className={styles.portfolio__table}>
              <thead>
                <tr className={styles.portfolio__tableHeader}>
                  <th>Protocol</th>
                  <th>Type</th>
                  <th>Position Value</th>
                  <th>APR</th>
                  <th>Claimable Rewards</th>
                </tr>
              </thead>
              <tbody>
                {defiPositions.map((position) => (
                  <tr key={position.id} className={styles.portfolio__tableRow}>
                    <td className={styles.portfolio__defiProtocol}>
                      {position.protocol}
                    </td>
                    <td className={styles.portfolio__defiType}>
                      {position.type.toUpperCase()}
                    </td>
                    <td className={styles.portfolio__defiValueAmount}>
                      {formatCurrency(
                        position.positionValue,
                        "USD",
                        showFinancialNumbers
                      )}
                    </td>
                    <td className={styles.portfolio__defiAprValue}>
                      {formatPercentage(position.apr, 2, showFinancialNumbers)}
                    </td>
                    <td className={styles.portfolio__defiRewardsValue}>
                      {formatCurrency(
                        position.claimableRewards,
                        "USD",
                        showFinancialNumbers
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
