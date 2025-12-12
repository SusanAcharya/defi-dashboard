import React from 'react';
import styles from './AnimatedBackground.module.scss';

export const AnimatedBackground: React.FC = () => {
  // Clean background - gradient is handled by body element
  return <div className={styles.animatedBackground} />;
};
