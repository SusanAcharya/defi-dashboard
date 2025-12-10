import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div className={`${styles.toast} ${styles[`toast_${type}`]}`}>
      <span className={styles.toast__message}>{message}</span>
      <button className={styles.toast__close} onClick={onClose}>
        ×
      </button>
    </div>,
    document.body
  );
};

