import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../Card/Card';
import styles from './AssetAllocation.module.scss';

const data = [
  { name: 'Other Assets', value: 4800, percentage: 40, color: '#ff6b6b' }, // Reddish-orange
  { name: 'Stablecoins', value: 3600, percentage: 30, color: '#4ecdc4' }, // Teal/mint green
  { name: 'Assets', value: 3600, percentage: 30, color: '#74b9ff' }, // Light blue
];

export const AssetAllocation: React.FC = () => {
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

