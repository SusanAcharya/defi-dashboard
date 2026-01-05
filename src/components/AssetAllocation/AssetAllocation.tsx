import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useWalletStore } from "@/store/walletStore";
import { convertBalanceToTokenAmount } from "@/utils/format";
import { Card } from "../Card/Card";
import styles from "./AssetAllocation.module.scss";

export const AssetAllocation: React.FC = () => {
  const { selectedWalletAddress, isGuest } = useWalletStore();

  // Get tokens for selected wallet
  const { data: tokens } = useQuery({
    queryKey: ["tokens", selectedWalletAddress],
    queryFn: async () => {
      if (!selectedWalletAddress || isGuest) return [];
      try {
        const response = await fetch(
          `${"http://localhost:8000/api"}/wallet/${selectedWalletAddress}`
        );
        const data = await response.json();
        return data.data?.user?.tokens || [];
      } catch {
        return [];
      }
    },
    enabled: !isGuest && !!selectedWalletAddress,
  });

  // Define token categories with colors
  const categories = [
    { names: ["STRK"], label: "STRK", color: "#ff6347" },
    { names: ["ETH"], label: "ETH", color: "#228b22" },
    { names: ["USDC", "USDT", "DAI"], label: "Stablecoins", color: "#9370db" },
    {
      names: ["DEEP", "ZKX", "MYSTR", "REKT"],
      label: "DeFi Tokens",
      color: "#3c78d8",
    },
    { names: [], label: "Other Assets", color: "#4a90e2" },
  ];

  // Helper function to calculate category value
  const calculateCategoryValue = (categoryNames: string[]): number => {
    if (!tokens || tokens.length === 0) return 0;

    const filteredTokens =
      categoryNames.length > 0
        ? tokens.filter((t: any) => categoryNames.includes(t.symbol))
        : tokens.filter(
            (t: any) =>
              !categories
                .slice(0, -1)
                .some((cat) => cat.names.includes(t.symbol))
          );

    return filteredTokens.reduce((sum: number, t: any) => {
      return sum + convertBalanceToTokenAmount(t.balance, t.decimals);
    }, 0);
  };

  // Convert tokens to asset allocation data
  const data = useMemo(() => {
    if (isGuest || !tokens || tokens.length === 0) {
      return [];
    }

    const categoryValues = categories.map((cat) => ({
      ...cat,
      value: calculateCategoryValue(cat.names),
    }));

    const totalValue = categoryValues.reduce((sum, cat) => sum + cat.value, 0);

    if (totalValue === 0) {
      return [];
    }

    return categoryValues
      .filter((cat) => cat.value > 0)
      .map((cat) => ({
        name: cat.label,
        value: cat.value,
        percentage: (cat.value / totalValue) * 100,
        color: cat.color,
      }));
  }, [tokens]);

  return (
    <Card title="Asset Allocation" className={styles.assetAllocation}>
      <div className={styles.assetAllocation__content}>
        <div className={styles.assetAllocation__chart}>
          <ResponsiveContainer
            width="100%"
            height={250}
            className={styles.assetAllocation__chartContainer}
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius="85%"
                innerRadius="0%"
                paddingAngle={2}
                dataKey="value"
                label={false}
                labelLine={false}
                stroke="rgba(0, 0, 0, 0.3)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className={styles.assetAllocation__tooltip}>
                        <div className={styles.assetAllocation__tooltipName}>
                          {data.name}
                        </div>
                        <div className={styles.assetAllocation__tooltipValue}>
                          $
                          {data.value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div
                          className={styles.assetAllocation__tooltipPercentage}
                        >
                          {data.percentage.toFixed(2)}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.assetAllocation__legend}>
          {data.map((item, index) => (
            <div key={index} className={styles.assetAllocation__legendItem}>
              <span
                className={styles.assetAllocation__legendColor}
                style={{ backgroundColor: item.color }}
              />
              <span
                className={styles.assetAllocation__legendLabel}
                data-percentage={`${item.percentage.toFixed(2)}%`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
