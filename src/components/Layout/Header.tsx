import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/walletStore';
import { useUIStore } from '@/store/uiStore';
import { formatAddress } from '@/utils/format';
import profileImage from '@/assets/profile.png';
import logoImage from '@/assets/logo.png';
import walletIcon from '@/assets/icons/wallet.png';
import settingsIcon from '@/assets/icons/settings.png';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { wallets, selectedWalletAddress, setSelectedWallet } = useWalletStore();
  const { streak, mobileNavOpen, setMobileNavOpen } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedWallet = selectedWalletAddress 
    ? wallets.find(w => w.address === selectedWalletAddress)
    : null;

  // Position dropdown menu and close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const positionDropdown = () => {
      if (dropdownOpen && buttonRef.current && dropdownMenuRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menu = dropdownMenuRef.current;
        const isMobile = window.innerWidth < 768; // Match your mobile breakpoint
        
        // Position the dropdown below the button
        menu.style.top = `${buttonRect.bottom + 4}px`;
        
        if (isMobile) {
          // On mobile, position from left with padding
          menu.style.left = '16px';
          menu.style.right = '16px';
          menu.style.width = 'auto';
        } else {
          // On desktop, position from right
          menu.style.right = `${window.innerWidth - buttonRect.right}px`;
          menu.style.left = 'auto';
        }
      }
    };

    if (dropdownOpen) {
      positionDropdown();
      window.addEventListener('resize', positionDropdown);
      window.addEventListener('scroll', positionDropdown, true);
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', positionDropdown);
      window.removeEventListener('scroll', positionDropdown, true);
    };
  }, [dropdownOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__left}>
          <div className={styles.header__logo} onClick={() => navigate('/')}>
            <img 
              src={logoImage} 
              alt="Kompass Finance" 
              className={styles.header__logoImage}
            />
            <span className={styles.header__logoText}>Kompass Finance</span>
          </div>
        </div>
        <div className={styles.header__actions}>
          {streak > 0 && (
            <div className={styles.header__streak}>
              🔥 {streak}
            </div>
          )}
          {wallets.length > 0 && (
            <div className={styles.header__walletDropdown} ref={dropdownRef}>
              <button
                ref={buttonRef}
                className={styles.header__walletDropdownButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={styles.header__walletDropdownText}>
                  {selectedWallet ? selectedWallet.name : 'ALL'}
                </span>
                <span className={styles.header__walletDropdownIcon}>
                  {dropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              {dropdownOpen && (
                <div 
                  ref={dropdownMenuRef}
                  className={styles.header__walletDropdownMenu}
                >
                  <button
                    className={`${styles.header__walletDropdownItem} ${
                      selectedWalletAddress === null ? styles.header__walletDropdownItem_active : ''
                    }`}
                    onClick={() => {
                      setSelectedWallet(null);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className={styles.header__walletDropdownItemLabel}>ALL</span>
                    <span className={styles.header__walletDropdownItemCount}>({wallets.length})</span>
                  </button>
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.address}
                      className={`${styles.header__walletDropdownItem} ${
                        selectedWalletAddress === wallet.address ? styles.header__walletDropdownItem_active : ''
                      }`}
                      onClick={() => {
                        setSelectedWallet(wallet.address);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className={styles.header__walletDropdownItemLabel}>{wallet.name}</span>
                      <span className={styles.header__walletDropdownItemAddress}>
                        {formatAddress(wallet.address, 4, 4)}
                      </span>
                      {!wallet.isMine && (
                        <span className={styles.header__walletDropdownItemBadge}>Other</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            className={styles.header__walletIcon}
            onClick={() => navigate('/wallet')}
            aria-label="Wallet"
            title="Wallet Management"
          >
            <img 
              src={walletIcon} 
              alt="Wallet"
              className={styles.header__iconImage}
            />
          </button>
          <button
            className={styles.header__settingsIcon}
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            title="Settings"
          >
            <img 
              src={settingsIcon} 
              alt="Settings"
              className={styles.header__iconImage}
            />
          </button>
          <button
            className={styles.header__profile}
            onClick={() => navigate('/profile')}
            aria-label="Profile"
          >
            <img 
              src={profileImage} 
              alt="Profile" 
              className={styles.header__avatar}
            />
          </button>
          <button
            className={styles.header__menuButton}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.header__menuIcon} ${mobileNavOpen ? styles.header__menuIcon_open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

