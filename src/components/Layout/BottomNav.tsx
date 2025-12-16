import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import homeIcon from '@/assets/icons/home.png';
import notificationIcon from '@/assets/icons/notification.png';
import styles from './BottomNav.module.scss';

const mobileNavItems = [
  { path: '/', label: 'Home', icon: null, iconImage: homeIcon },
  { path: '/explore', label: 'Explore', icon: '🔍', iconImage: null },
  { path: '/portfolio', label: 'Portfolio', icon: '💼', iconImage: null },
  { path: '/history', label: 'History', icon: '📜', iconImage: null },
  { path: '/notifications', label: 'Notifications', icon: null, iconImage: notificationIcon },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.bottomNav}>
      {mobileNavItems.map((item) => (
        <button
          key={item.path}
          className={`${styles.bottomNav__item} ${
            location.pathname === item.path ? styles.bottomNav__item_active : ''
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.iconImage ? (
            <img 
              src={item.iconImage} 
              alt={item.label}
              className={styles.bottomNav__iconImage}
            />
          ) : (
            <span className={styles.bottomNav__icon}>{item.icon}</span>
          )}
          <span className={styles.bottomNav__label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

