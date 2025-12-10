import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../Card/Card';
import styles from './PortfolioExposure.module.scss';

const data = [
  { name: 'Invest A', value: 55, color: '#ef4444' },
  { name: 'Invest B', value: 35, color: '#4a9eff' },
  { name: 'Others', value: 10, color: '#ffd700' },
];

export const PortfolioExposure: React.FC = () => {
  return (
    <Card title="PORTFOLIO EXPOSURE" className={styles.portfolioExposure}>
      <div className={styles.portfolioExposure__content}>
        <div className={styles.portfolioExposure__chart}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.portfolioExposure__legend}>
          {data.map((item, index) => (
            <div key={index} className={styles.portfolioExposure__legendItem}>
              <span
                className={styles.portfolioExposure__legendColor}
                style={{ color: item.color }}
              >
                {item.name}
              </span>
              <span className={styles.portfolioExposure__legendValue}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

