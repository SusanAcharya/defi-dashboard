import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
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

  // Determine if we should show brush (for larger timelines)
  const showBrush = useMemo(() => {
    return selectedTimeframe === '90D' || selectedTimeframe === '1Y' || selectedTimeframe === 'ALL';
  }, [selectedTimeframe]);

  // Calculate brush start/end based on data length
  const brushStartIndex = useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    // For large datasets, start showing from 70% of the data
    if (showBrush && chartData.length > 30) {
      return Math.floor(chartData.length * 0.3);
    }
    return 0;
  }, [chartData, showBrush]);

  const brushEndIndex = useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    return chartData.length - 1;
  }, [chartData]);

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
          <ResponsiveContainer width="100%" height={showBrush ? 380 : 350}>
            <LineChart 
              data={chartData || []}
              margin={{ top: 10, right: 20, left: 10, bottom: showBrush ? 60 : 10 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8c00" stopOpacity={0.5} />
                  <stop offset="50%" stopColor="#ff8c00" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff8c00" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ffa500" stopOpacity={1} />
                </linearGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255, 140, 0, 0.1)" 
                vertical={false}
                horizontal={true}
              />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255, 140, 0, 0.3)"
                tick={{ fill: '#707070', fontSize: 11 }}
                tickLine={{ stroke: 'rgba(255, 140, 0, 0.2)' }}
                axisLine={{ stroke: 'rgba(255, 140, 0, 0.2)' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="rgba(255, 140, 0, 0.3)"
                tick={{ fill: '#707070', fontSize: 11 }}
                tickLine={{ stroke: 'rgba(255, 140, 0, 0.2)' }}
                axisLine={{ stroke: 'rgba(255, 140, 0, 0.2)' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
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
                      <div className={styles.portfolioChart__tooltip}>
                        <div className={styles.portfolioChart__tooltipLabel}>{label}</div>
                        <div className={styles.portfolioChart__tooltipValue}>
                          {formatCurrency(value, 'USD', true)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: '#ff8c00', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                fill="url(#areaGradient)"
                stroke="none"
                isAnimationActive={true}
                animationDuration={800}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ 
                  r: 5, 
                  fill: '#ff8c00', 
                  stroke: '#ffffff', 
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0 0 4px rgba(255, 140, 0, 0.8))' }
                }}
                filter="url(#lineGlow)"
                isAnimationActive={true}
                animationDuration={800}
              />
              {showBrush && chartData && chartData.length > 0 && (
                <Brush
                  dataKey="date"
                  height={30}
                  stroke="rgba(255, 140, 0, 0.5)"
                  fill="rgba(255, 140, 0, 0.1)"
                  startIndex={brushStartIndex}
                  endIndex={brushEndIndex}
                  tickFormatter={(value) => {
                    // Format date for brush
                    if (typeof value === 'string') {
                      return value.length > 8 ? value.slice(0, 6) : value;
                    }
                    return value;
                  }}
                />
              )}
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

