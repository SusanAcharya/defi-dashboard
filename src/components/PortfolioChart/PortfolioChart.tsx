import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '../Card/Card';
import styles from './PortfolioChart.module.scss';

const timeframes = ['1D', '7D', '30D', '90D', '1Y', 'ALL'];

export const PortfolioChart: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30D');
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const { selectedWalletAddress } = useWalletStore();

  // Get portfolio data for selected wallet or combined
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio', selectedWalletAddress],
    queryFn: ({ queryKey }) => api.getPortfolio(queryKey[1] as string | null),
  });

  // Get chart data
  const { data: chartData } = useQuery({
    queryKey: ['portfolioChart', selectedWalletAddress, selectedTimeframe],
    queryFn: ({ queryKey }) => api.getPortfolioChartData(queryKey[1] as string | null, queryKey[2] as string),
  });

  // Get tokens for selected wallet or combined
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['tokens', selectedWalletAddress],
    queryFn: ({ queryKey }) => api.getTokens(queryKey[1] as string | null),
  });

  return (
    <div className={styles.portfolioChart}>
      <Card title="VIGOR TRENDS (Historical PPL)">
        <div className={styles.portfolioChart__header}>
          <div>
            <div className={styles.portfolioChart__value}>
              {portfolio && formatCurrency(portfolio.totalValue, 'USD', showFinancialNumbers)}
            </div>
            {portfolio && (
              <div className={styles.portfolioChart__change}>
                {formatPercentage(portfolio.pnl24hPercent, 2, showFinancialNumbers)} (24h)
              </div>
            )}
          </div>
        </div>
        <div className={styles.portfolioChart__timeframes}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`${styles.portfolioChart__timeframe} ${
                selectedTimeframe === tf ? styles.portfolioChart__timeframe_active : ''
              }`}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className={styles.portfolioChart__chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData || []}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
              <XAxis 
                dataKey="date" 
                stroke="#8b5cf6" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#b0b0c0' }}
              />
              <YAxis 
                stroke="#8b5cf6" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#b0b0c0' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(26, 26, 46, 0.95)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                }}
                labelStyle={{ color: '#8b5cf6' }}
                formatter={(value: number) => formatCurrency(value, 'USD', true)}
              />
              <Area
                type="monotone"
                dataKey="value"
                fill="url(#areaGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 2 }}
                filter="url(#lineGlow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Token Holdings">
        {isLoading ? (
          <div>Loading tokens...</div>
        ) : (
          <div className={styles.portfolioChart__tokens}>
            {tokens?.map((token) => (
              <div key={token.id} className={styles.portfolioChart__token}>
                <div className={styles.portfolioChart__tokenInfo}>
                  <div className={styles.portfolioChart__tokenSymbol}>{token.symbol}</div>
                  <div className={styles.portfolioChart__tokenName}>{token.name}</div>
                </div>
                <div className={styles.portfolioChart__tokenBalance}>
                  <div>{showFinancialNumbers ? token.balance : '••••'}</div>
                  <div className={styles.portfolioChart__tokenValue}>
                    {formatCurrency(token.usdValue, 'USD', showFinancialNumbers)}
                  </div>
                </div>
                <div
                  className={`${styles.portfolioChart__tokenChange} ${
                    token.change24h >= 0
                      ? styles.portfolioChart__tokenChange_positive
                      : styles.portfolioChart__tokenChange_negative
                  }`}
                >
                  {showFinancialNumbers 
                    ? `${formatPercentage(token.change24h, 2, true)} (24h)`
                    : '••• (24h)'
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

