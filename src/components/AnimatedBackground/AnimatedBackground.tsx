import React from 'react';
import styles from './AnimatedBackground.module.scss';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className={styles.animatedBackground}>
      {/* Gold smoke particles */}
      <div className={styles.animatedBackground__particle} style={{ left: '10%', animationDelay: '0s', animationDuration: '20s' }} />
      <div className={styles.animatedBackground__particle} style={{ left: '30%', animationDelay: '2s', animationDuration: '25s' }} />
      <div className={styles.animatedBackground__particle} style={{ left: '50%', animationDelay: '4s', animationDuration: '18s' }} />
      <div className={styles.animatedBackground__particle} style={{ left: '70%', animationDelay: '1s', animationDuration: '22s' }} />
      <div className={styles.animatedBackground__particle} style={{ left: '90%', animationDelay: '3s', animationDuration: '24s' }} />
      
      {/* Red blood-like particles */}
      <div className={`${styles.animatedBackground__particle} ${styles.animatedBackground__particle_red}`} style={{ left: '15%', animationDelay: '5s', animationDuration: '30s' }} />
      <div className={`${styles.animatedBackground__particle} ${styles.animatedBackground__particle_red}`} style={{ left: '60%', animationDelay: '8s', animationDuration: '35s' }} />
      
      {/* Smoke wisps */}
      <div className={styles.animatedBackground__smoke} style={{ left: '20%', animationDelay: '0s' }} />
      <div className={styles.animatedBackground__smoke} style={{ left: '80%', animationDelay: '4s' }} />
      
      {/* Gritty overlay pattern */}
      <div className={styles.animatedBackground__grit} />
    </div>
  );
};

