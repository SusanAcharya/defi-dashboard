import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '../Card/Card';
import styles from './AssetAllocation.module.scss';

export const AssetAllocation: React.FC = () => {
  const { selectedWalletAddress } = useWalletStore();
  
  // Get tokens for selected wallet or combined
  const { data: tokens } = useQuery({
    queryKey: ['tokens', selectedWalletAddress],
    queryFn: ({ queryKey }) => api.getTokens(queryKey[1] as string | null),
  });

  // Convert tokens to asset allocation data
  const data = useMemo(() => {
    if (!tokens || tokens.length === 0) {
      return [
        { name: 'STRK', value: 48000, percentage: 40.00, color: '#ff6347' }, // Red-orange
        { name: 'ETH', value: 36000, percentage: 30.00, color: '#228b22' }, // Dark green
        { name: 'Stablecoins', value: 24000, percentage: 20.00, color: '#9370db' }, // Purple
        { name: 'DeFi Tokens', value: 9600, percentage: 8.00, color: '#ff8c00' }, // Orange
        { name: 'Other Assets', value: 2400, percentage: 2.00, color: '#4a90e2' }, // Blue
      ];
    }

    // Group tokens into 5 categories
    const stablecoins = tokens.filter(t => ['USDC', 'USDT', 'DAI'].includes(t.symbol));
    const eth = tokens.filter(t => t.symbol === 'ETH');
    const strk = tokens.filter(t => t.symbol === 'STRK');
    const defiTokens = tokens.filter(t => ['DEEP', 'ZKX', 'MYSTR', 'REKT'].includes(t.symbol));
    const other = tokens.filter(t => !['USDC', 'USDT', 'DAI', 'ETH', 'STRK', 'DEEP', 'ZKX', 'MYSTR', 'REKT'].includes(t.symbol));

    const stablecoinsValue = stablecoins.reduce((sum, t) => sum + t.usdValue, 0);
    const ethValue = eth.reduce((sum, t) => sum + t.usdValue, 0);
    const strkValue = strk.reduce((sum, t) => sum + t.usdValue, 0);
    const defiValue = defiTokens.reduce((sum, t) => sum + t.usdValue, 0);
    const otherValue = other.reduce((sum, t) => sum + t.usdValue, 0);
    const totalValue = stablecoinsValue + ethValue + strkValue + defiValue + otherValue;

    const result = [];
    if (strkValue > 0) {
      result.push({
        name: 'STRK',
        value: strkValue,
        percentage: (strkValue / totalValue) * 100,
        color: '#ff6347', // Red-orange
      });
    }
    if (ethValue > 0) {
      result.push({
        name: 'ETH',
        value: ethValue,
        percentage: (ethValue / totalValue) * 100,
        color: '#228b22', // Dark green
      });
    }
    if (stablecoinsValue > 0) {
      result.push({
        name: 'Stablecoins',
        value: stablecoinsValue,
        percentage: (stablecoinsValue / totalValue) * 100,
        color: '#9370db', // Purple
      });
    }
    if (defiValue > 0) {
      result.push({
        name: 'DeFi Tokens',
        value: defiValue,
        percentage: (defiValue / totalValue) * 100,
        color: '#ff8c00', // Orange
      });
    }
    if (otherValue > 0) {
      result.push({
        name: 'Other Assets',
        value: otherValue,
        percentage: (otherValue / totalValue) * 100,
        color: '#4a90e2', // Blue
      });
    }

    // If no data, return default 5 items
    return result.length > 0 ? result : [
      { name: 'STRK', value: 48000, percentage: 40.00, color: '#ff6347' },
      { name: 'ETH', value: 36000, percentage: 30.00, color: '#228b22' },
      { name: 'Stablecoins', value: 24000, percentage: 20.00, color: '#9370db' },
      { name: 'DeFi Tokens', value: 9600, percentage: 8.00, color: '#ff8c00' },
      { name: 'Other Assets', value: 2400, percentage: 2.00, color: '#4a90e2' },
    ];
  }, [tokens]);

  return (
    <Card title="THE CUT (Asset Allocation)" className={styles.assetAllocation}>
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
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
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
                        <div className={styles.assetAllocation__tooltipName}>{data.name}</div>
                        <div className={styles.assetAllocation__tooltipValue}>
                          ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={styles.assetAllocation__tooltipPercentage}>
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

