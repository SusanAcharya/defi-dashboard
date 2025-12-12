import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components';
import styles from './Portfolio.module.scss';

const timeframes = ['1D', '7D', '30D', '90D', '1Y', 'ALL'];

// Mock PNL data
const pnlData = [
  { date: 'Jan', value: 100000 },
  { date: 'Feb', value: 120000 },
  { date: 'Mar', value: 110000 },
  { date: 'Apr', value: 130000 },
  { date: 'May', value: 125000 },
  { date: 'Jun', value: 140000 },
];

export const Portfolio: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30D');
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: api.getPortfolio,
  });
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: api.getTokens,
  });

  return (
    <div className={styles.portfolio}>
      <Card title="VIGOR TRENDS (Historical PPL)">
        <div className={styles.portfolio__header}>
          <div>
            <div className={styles.portfolio__value}>
              {portfolio && formatCurrency(portfolio.totalValue, 'USD', showFinancialNumbers)}
            </div>
            {portfolio && (
              <div className={styles.portfolio__change}>
                {formatPercentage(portfolio.pnl24hPercent, 2, showFinancialNumbers)} (24h)
              </div>
            )}
          </div>
        </div>
        <div className={styles.portfolio__timeframes}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`${styles.portfolio__timeframe} ${
                selectedTimeframe === tf ? styles.portfolio__timeframe_active : ''
              }`}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className={styles.portfolio__chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pnlData}>
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
          <div className={styles.portfolio__tokens}>
            {tokens?.map((token) => (
              <div key={token.id} className={styles.portfolio__token}>
                <div className={styles.portfolio__tokenInfo}>
                  <div className={styles.portfolio__tokenSymbol}>{token.symbol}</div>
                  <div className={styles.portfolio__tokenName}>{token.name}</div>
                </div>
                <div className={styles.portfolio__tokenBalance}>
                  <div>{token.balance}</div>
                  <div className={styles.portfolio__tokenValue}>
                    {formatCurrency(token.usdValue, 'USD', showFinancialNumbers)}
                  </div>
                </div>
                <div
                  className={`${styles.portfolio__tokenChange} ${
                    token.change24h >= 0
                      ? styles.portfolio__tokenChange_positive
                      : styles.portfolio__tokenChange_negative
                  }`}
                >
                  {formatPercentage(token.change24h, 2, showFinancialNumbers)} (24h)
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

