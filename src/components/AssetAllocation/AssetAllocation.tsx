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
        { name: 'Other Assets', value: 4800, percentage: 40, color: '#ff6b6b' },
        { name: 'Stablecoins', value: 3600, percentage: 30, color: '#4ecdc4' },
        { name: 'Assets', value: 3600, percentage: 30, color: '#74b9ff' },
      ];
    }

    // Group tokens by category
    const stablecoins = tokens.filter(t => ['USDC', 'USDT', 'DAI'].includes(t.symbol));
    const eth = tokens.filter(t => t.symbol === 'ETH');
    const other = tokens.filter(t => !['USDC', 'USDT', 'DAI', 'ETH'].includes(t.symbol));

    const stablecoinsValue = stablecoins.reduce((sum, t) => sum + t.usdValue, 0);
    const ethValue = eth.reduce((sum, t) => sum + t.usdValue, 0);
    const otherValue = other.reduce((sum, t) => sum + t.usdValue, 0);
    const totalValue = stablecoinsValue + ethValue + otherValue;

    const result = [];
    if (stablecoinsValue > 0) {
      result.push({
        name: 'Stablecoins',
        value: stablecoinsValue,
        percentage: (stablecoinsValue / totalValue) * 100,
        color: '#4ecdc4',
      });
    }
    if (ethValue > 0) {
      result.push({
        name: 'ETH',
        value: ethValue,
        percentage: (ethValue / totalValue) * 100,
        color: '#74b9ff',
      });
    }
    if (otherValue > 0) {
      result.push({
        name: 'Other Assets',
        value: otherValue,
        percentage: (otherValue / totalValue) * 100,
        color: '#ff6b6b',
      });
    }

    return result.length > 0 ? result : [
      { name: 'Other Assets', value: 4800, percentage: 40, color: '#ff6b6b' },
      { name: 'Stablecoins', value: 3600, percentage: 30, color: '#4ecdc4' },
      { name: 'Assets', value: 3600, percentage: 30, color: '#74b9ff' },
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
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={0}
                dataKey="value"
                label={false}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(26, 26, 46, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
                labelStyle={{ color: '#ffffff' }}
                itemStyle={{ color: '#ffffff' }}
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
                data-percentage={`${item.percentage.toFixed(2)} %`}
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

