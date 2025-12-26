import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/walletStore';
import { useUIStore } from '@/store/uiStore';
import { formatAddress } from '@/utils/format';
import profileImage from '@/assets/profile.png';
import logoImage from '@/assets/logo.png';
import walletIcon from '@/assets/icons/wallet.png';
import settingsIcon from '@/assets/icons/settings.png';
import checkinIcon from '@/assets/checkin.png';
import checkedinIcon from '@/assets/checkedin.png';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { wallets, selectedWalletAddress, setSelectedWallet } = useWalletStore();
  const { streak, mobileNavOpen, setMobileNavOpen, checkedInToday, lastCheckIn, checkIn } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCheckIn = () => {
    if (!checkedInToday) {
      checkIn();
    }
  };

  const selectedWallet = selectedWalletAddress 
    ? wallets.find(w => w.address === selectedWalletAddress)
    : null;

  // Calculate time remaining until next check-in
  useEffect(() => {
    if (checkedInToday && lastCheckIn) {
      const updateTimeRemaining = () => {
        const now = Date.now();
        const nextCheckInTime = lastCheckIn + (24 * 60 * 60 * 1000); // 24 hours from last check-in
        const remaining = nextCheckInTime - now;

        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          
          setTimeRemaining(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        } else {
          setTimeRemaining('00:00:00');
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining('');
    }
  }, [checkedInToday, lastCheckIn]);

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
          {/* Check-in Icon - Only show when not checked in */}
          {!checkedInToday && (
            <div 
              className={styles.header__checkIn}
              onClick={handleCheckIn}
            >
              <img 
                src={checkinIcon} 
                alt="Check-in"
                className={styles.header__checkInIcon}
              />
            </div>
          )}
          {streak > 0 && (
            <div 
              className={styles.header__streak}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {checkedInToday ? (
                <img 
                  src={checkedinIcon} 
                  alt="Checked in" 
                  className={styles.header__streakIcon}
                />
              ) : (
                <span>🔥</span>
              )}
              <span>{streak}</span>
              {showTooltip && checkedInToday && timeRemaining && (
                <div className={styles.header__streakTooltip}>
                  Next check-in in: {timeRemaining}
                </div>
              )}
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

