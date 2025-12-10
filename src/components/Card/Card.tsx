import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <h2 className={styles.card__title}>{title}</h2>}
      {children}
    </div>
  );
};

