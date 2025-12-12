import React from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'cyan' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gold', size = 'md' }) => {
  return (
    <span className={`${styles.badge} ${styles[`badge_${variant}`]} ${styles[`badge_${size}`]}`}>
      {label}
    </span>
  );
};

