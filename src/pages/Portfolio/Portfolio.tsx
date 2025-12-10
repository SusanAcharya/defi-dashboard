import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
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
      <Card>
        <div className={styles.portfolio__header}>
          <div>
            <h2>Portfolio Value</h2>
            <div className={styles.portfolio__value}>
              {portfolio && formatCurrency(portfolio.totalValue)}
            </div>
            {portfolio && (
              <div className={styles.portfolio__change}>
                {formatPercentage(portfolio.pnl24hPercent)}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  background: '#2d2d2d',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4a9eff"
                strokeWidth={2}
                dot={false}
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
                    {formatCurrency(token.usdValue)}
                  </div>
                </div>
                <div
                  className={`${styles.portfolio__tokenChange} ${
                    token.change24h >= 0
                      ? styles.portfolio__tokenChange_positive
                      : styles.portfolio__tokenChange_negative
                  }`}
                >
                  {formatPercentage(token.change24h)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

