import React, { useEffect, useState } from 'react';
import logoImage from '@/assets/logo.png';
import styles from './Landing.module.scss';

type IconName =
  | 'wallet'
  | 'bell'
  | 'nodes'
  | 'shield'
  | 'chart'
  | 'sparkles'
  | 'plug'
  | 'zap'
  | 'gem';

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (name) {
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M3.8 7.2h14.6a1.8 1.8 0 0 1 1.8 1.8v9.2a1.8 1.8 0 0 1-1.8 1.8H5.6a1.8 1.8 0 0 1-1.8-1.8V8.4c0-.7.5-1.2 1.2-1.2Z" />
          <path d="M3.8 9.2h10.8" />
          <path d="M16.2 13.1h3.8" />
          <circle cx="16.2" cy="13.1" r="1.2" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M12 21a2.2 2.2 0 0 0 2.1-1.6" />
          <path d="M18 15.2V11a6 6 0 1 0-12 0v4.2l-1.5 1.6h15L18 15.2Z" />
        </svg>
      );
    case 'nodes':
      return (
        <svg {...common}>
          <circle cx="6.5" cy="12" r="2" />
          <circle cx="17.5" cy="7.5" r="2" />
          <circle cx="17.5" cy="16.5" r="2" />
          <path d="M8.4 11l6.9-2.7" />
          <path d="M8.4 13l6.9 2.7" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 2.7 19 6v6.3c0 5-3.1 8.8-7 9.9-3.9-1.1-7-4.9-7-9.9V6l7-3.3Z" />
          <path d="M12 8v4.4" />
          <path d="M12 16.3h.01" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 19.5V4.5" />
          <path d="M4 19.5h16" />
          <path d="M7 14l3-3 3 2 5-6" />
          <path d="M18 7v3h-3" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="M12 2.8l1.1 3.1 3.1 1.1-3.1 1.1L12 11.2l-1.1-3.1L7.8 7l3.1-1.1L12 2.8Z" />
          <path d="M19 11.6l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
          <path d="M6 13.2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...common}>
          <path d="M9 7V4.5" />
          <path d="M15 7V4.5" />
          <path d="M7.5 7h9" />
          <path d="M8.5 7v4.4a3.5 3.5 0 0 0 7 0V7" />
          <path d="M12 14.9V21" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...common}>
          <path d="M13 2 4.8 13H12l-1 9 8.2-11H12l1-9Z" />
        </svg>
      );
    case 'gem':
      return (
        <svg {...common}>
          <path d="M6.2 4.5h11.6L21 9l-9 12L3 9l3.2-4.5Z" />
          <path d="M3 9h18" />
          <path d="M8.2 9 12 21l3.8-12" />
        </svg>
      );
  }
}

const features = [
  {
    icon: 'wallet',
    title: 'Portfolio Tracking',
    description: 'Aggregate all your Starknet wallets into one unified dashboard. Track balances, DeFi positions, and NFTs in real-time.',
  },
  {
    icon: 'bell',
    title: 'Smart Alerts',
    description: 'Never miss important wallet activity. Get instant notifications for transactions, airdrops, and protocol updates.',
  },
  {
    icon: 'nodes',
    title: 'DeFi Insights',
    description: 'Monitor your lending positions, LP rewards, and protocol exposure. Stay ahead with actionable analytics.',
  },
  {
    icon: 'shield',
    title: 'Risk Management',
    description: 'Track debt ratios and get liquidation warnings. Protect your positions with customizable alert thresholds.',
  },
  {
    icon: 'chart',
    title: 'Market Data',
    description: 'Access real-time price charts, token analytics, and market trends for the Starknet ecosystem.',
  },
  {
    icon: 'sparkles',
    title: 'Opportunity Discovery',
    description: 'Explore high-yield pools, lending options, and staking strategies. Find the best opportunities on Starknet.',
  },
];

const missionPoints = [
  {
    icon: 'plug',
    title: 'Seamless Integration',
    description: 'Deep protocol connections for real-time data',
  },
  {
    icon: 'zap',
    title: 'Lightning Fast',
    description: 'Instant alerts and live portfolio updates',
  },
  {
    icon: 'gem',
    title: 'Free Forever',
    description: 'No hidden fees or premium tiers',
  },
];

const tokenTape = [
  { symbol: 'ETH', name: 'Ether', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'STRK', name: 'Starknet', logo: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png' },
  { symbol: 'USDC', name: 'USD Coin', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
  { symbol: 'USDT', name: 'Tether', logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { symbol: 'wBTC', name: 'Wrapped Bitcoin', logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
  { symbol: 'DAI', name: 'Dai', logo: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
  { symbol: 'EKUBO', name: 'Ekubo', logo: 'https://assets.coingecko.com/coins/images/0/small/ekubo.png' },
  { symbol: 'LORDS', name: 'Realms', logo: 'https://assets.coingecko.com/coins/images/0/small/lords.png' },
];

export const Landing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [compassRotation, setCompassRotation] = useState(0);
  const lastScrollY = React.useRef(0);
  const rotationRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const revealObserverRef = React.useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setHeaderScrolled(currentScrollY > 50);

      // Subtle compass rotation based on scroll direction + delta
      const delta = currentScrollY - lastScrollY.current; // +down, -up
      rotationRef.current += delta * 0.08; // tweak for subtlety
      lastScrollY.current = currentScrollY;

      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(() => {
          setCompassRotation(rotationRef.current);
          rafRef.current = null;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!els.length) return;

    revealObserverRef.current?.disconnect();
    revealObserverRef.current = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add(styles.landing__revealVisible);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    for (const el of els) revealObserverRef.current.observe(el);

    return () => {
      revealObserverRef.current?.disconnect();
      revealObserverRef.current = null;
    };
  }, []);

  const handleLaunchApp = () => {
    window.open('https://t.me/kompass_finance_bot', '_blank', 'noopener,noreferrer');
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showBackToTop = scrollY > 650;

  return (
    <div className={styles.landing}>
      {/* Animated Background */}
      <div className={styles.landing__bgEffects}>
        <div className={styles.landing__orb1} />
        <div className={styles.landing__orb2} />
        <div className={styles.landing__orb3} />
        <div className={styles.landing__grid} />
        <div className={styles.landing__stars} />
        {/* Single global compass watermark (masked out of hero via CSS) */}
        <div
          className={styles.landing__compassBg}
          aria-hidden="true"
          style={{ transform: `translate(-50%, -50%) rotate(${compassRotation}deg)` }}
        >
          <img src={logoImage} alt="" className={styles.landing__compassBgImage} />
        </div>
        <div className={styles.landing__noise} />
        <div className={styles.landing__scanlines} />
        <div className={styles.landing__vignette} />
      </div>

      {showBackToTop && (
        <button className={styles.landing__toTop} onClick={scrollToTop} aria-label="Back to top">
          <span className={styles.landing__toTopIcon}>↑</span>
        </button>
      )}

      {/* Enhanced Header */}
      <header className={`${styles.landing__header} ${headerScrolled ? styles.landing__header_scrolled : ''}`}>
        <div className={styles.landing__headerContent}>
          <div className={styles.landing__logo}>
            <div className={styles.landing__logoGlow} />
            <img src={logoImage} alt="Kompass Finance" className={styles.landing__logoImage} />
            <div className={styles.landing__logoTextWrapper}>
              <span className={styles.landing__logoText}>Kompass</span>
              <span className={styles.landing__logoSubtext}>Finance</span>
            </div>
          </div>
          <nav className={styles.landing__nav}>
            <a href="#features" className={styles.landing__navLink}>
              <span className={styles.landing__navLinkText}>Features</span>
              <span className={styles.landing__navLinkLine} />
            </a>
            <a href="#how-it-works" className={styles.landing__navLink}>
              <span className={styles.landing__navLinkText}>How it works</span>
              <span className={styles.landing__navLinkLine} />
            </a>
            <a href="https://docs.kompass.finance" target="_blank" rel="noopener noreferrer" className={styles.landing__navLink}>
              <span className={styles.landing__navLinkText}>Docs</span>
              <span className={styles.landing__navLinkLine} />
            </a>
          </nav>
          <div className={styles.landing__headerActions}>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`${styles.landing__hero} ${isVisible ? styles.landing__hero_visible : ''}`}>
        <div className={styles.landing__heroContent}>
          <div className={styles.landing__badge}>
            StarkNet Wallet Tracker
          </div>
          <h1 className={styles.landing__title}>
            Get Notified <span className={styles.landing__titleHighlight}>Instantly</span>
          </h1>
          <p className={styles.landing__subtitle}>
            Track any wallet. Get instant Telegram alerts for swaps, transfers, DeFi positions, and more.
          </p>
          <div className={styles.landing__heroCTA}>
            <button className={styles.landing__primaryButton} onClick={handleLaunchApp}>
              <span className={styles.landing__buttonIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </span>
              Add to Telegram
            </button>
            <button className={styles.landing__secondaryButton} onClick={() => scrollToId('how-it-works')}>
              <span className={styles.landing__buttonIcon} aria-hidden="true">↘</span>
              See How It Works
            </button>
          </div>
        </div>
        <div className={styles.landing__heroVisual} style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <div className={styles.landing__heroTerminal}>
            <div className={styles.landing__terminalTopBar}>
              <div className={styles.landing__terminalDots}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.landing__terminalTitle}>KOMPASS // OPS</div>
              <div className={styles.landing__terminalStatus}>
                <span className={styles.landing__terminalStatusDot} />
                live
              </div>
            </div>

            <div className={styles.landing__terminalBody}>
              <div className={styles.landing__radar}>
                <div className={styles.landing__radarGrid} />
                <div className={styles.landing__radarSweep} />
                <div className={styles.landing__radarCore}>
                  <img src={logoImage} alt="Kompass" className={styles.landing__radarLogo} />
                </div>
                <div className={styles.landing__radarBlip} style={{ '--x': '22%', '--y': '34%', '--d': '0s' } as React.CSSProperties} />
                <div className={styles.landing__radarBlip} style={{ '--x': '68%', '--y': '28%', '--d': '1.2s' } as React.CSSProperties} />
                <div className={styles.landing__radarBlip} style={{ '--x': '58%', '--y': '72%', '--d': '2.4s' } as React.CSSProperties} />
                <div className={styles.landing__radarBlip} style={{ '--x': '30%', '--y': '78%', '--d': '3.1s' } as React.CSSProperties} />
              </div>

              <div className={styles.landing__intelStack}>
                <div className={styles.landing__intelCard} data-tone="danger">
                  <div className={styles.landing__intelHeader}>
                    <span className={styles.landing__intelTag}>ALERT</span>
                    <span className={styles.landing__intelTime}>NOW</span>
                  </div>
                  <div className={styles.landing__intelLine}>
                    <span className={styles.landing__intelKey}>Health</span>
                    <span className={styles.landing__intelValue}>1.52×</span>
                  </div>
                  <div className={styles.landing__intelSub}>Add collateral to stay safe.</div>
                </div>

                <div className={styles.landing__intelCard} data-tone="neon">
                  <div className={styles.landing__intelHeader}>
                    <span className={styles.landing__intelTag}>WALLET</span>
                    <span className={styles.landing__intelTime}>18:15</span>
                  </div>
                  <div className={styles.landing__intelLine}>
                    <span className={styles.landing__intelMono}>0x157f...3988</span>
                  </div>
                  <div className={styles.landing__intelSub}>Connected • Watching 100+ protocols</div>
                </div>

                <div className={styles.landing__intelCard} data-tone="cool">
                  <div className={styles.landing__intelHeader}>
                    <span className={styles.landing__intelTag}>TX</span>
                    <span className={styles.landing__intelTime}>2m</span>
                  </div>
                  <div className={styles.landing__intelLine}>
                    <span className={styles.landing__intelMono}>swap</span>
                    <span className={styles.landing__intelValueGreen}>+179228</span>
                    <span className={styles.landing__intelMono}>0x3fe2…e7ac</span>
                  </div>
                  <div className={styles.landing__intelSub}>Telegram pings in real time.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Ticker */}
      <section className={styles.landing__tokenTicker} aria-label="Tracked tokens">
        <div className={styles.landing__tokenTickerHeader}>
          <span className={styles.landing__tokenTickerKicker}>Tracked tokens</span>
          <span className={styles.landing__tokenTickerHint}>…and more.</span>
        </div>
        <div className={styles.landing__tokenTickerViewport}>
          <div className={styles.landing__tokenTickerTrack}>
            {[...tokenTape, ...tokenTape].map((t, i) => (
              <div key={`${t.symbol}-${i}`} className={styles.landing__tokenPill}>
                {t.logo && (
                  <img 
                    src={t.logo} 
                    alt={t.symbol} 
                    className={styles.landing__tokenLogo}
                    onError={(e) => {
                      // Fallback to dot if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                {!t.logo && <span className={styles.landing__tokenDot} aria-hidden="true" />}
                <span className={styles.landing__tokenSymbol}>{t.symbol}</span>
                <span className={styles.landing__tokenName}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.landing__features}>
        <div className={`${styles.landing__sectionHeader} ${styles.landing__reveal} ${styles.landing__revealUp}`} data-reveal>
          <span className={styles.landing__sectionBadge}>✨ Features</span>
          <h2 className={styles.landing__sectionTitle}>Everything You Need</h2>
          <p className={styles.landing__sectionSubtitle}>
            Comprehensive tools designed for the Starknet community
          </p>
        </div>
        <div className={styles.landing__featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${styles.landing__featureCard} ${styles.landing__reveal} ${
                index % 2 === 0 ? styles.landing__revealLeft : styles.landing__revealRight
              }`}
              style={{ transitionDelay: `${Math.min(index, 5) * 90}ms` }}
              data-reveal
            >
                <div className={styles.landing__featureIcon}>
                  <Icon name={feature.icon as IconName} />
                </div>
              <h3 className={styles.landing__featureTitle}>{feature.title}</h3>
              <p className={styles.landing__featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced About/Mission Section */}
      <section id="how-it-works" className={styles.landing__about}>
        <div className={styles.landing__aboutContainer}>
          {/* Subtle dossier vibe */}
      
          <div className={`${styles.landing__aboutHeader} ${styles.landing__reveal} ${styles.landing__revealUp}`} data-reveal>
            <span className={styles.landing__sectionBadge}>🎯 Our Mission</span>
            <h2 className={styles.landing__aboutTitle}>
              Bridging Users & Protocols
              <span className={styles.landing__aboutTitleHighlight}> on Starknet</span>
            </h2>
            <p className={styles.landing__aboutSubtitle}>
              We're building the ultimate DeFi companion. Our platform delivers seamless communication 
              between you and the protocols you use, ensuring you never miss an opportunity.
            </p>
          </div>
          
          <div className={styles.landing__missionGrid}>
            {missionPoints.map((point, index) => (
              <div
                key={index}
                className={`${styles.landing__missionCard} ${styles.landing__reveal} ${
                  index % 2 === 0 ? styles.landing__revealRight : styles.landing__revealLeft
                }`}
                style={{ transitionDelay: `${Math.min(index, 5) * 110}ms` }}
                data-reveal
              >
                <div className={styles.landing__missionIconWrapper}>
                  <span className={styles.landing__missionIcon}>
                    <Icon name={point.icon as IconName} />
                  </span>
                  <div className={styles.landing__missionIconGlow} />
                </div>
                <h3 className={styles.landing__missionTitle}>{point.title}</h3>
                <p className={styles.landing__missionDescription}>{point.description}</p>
              </div>
            ))}
          </div>

          <div className={`${styles.landing__aboutVisual} ${styles.landing__reveal} ${styles.landing__revealUp}`} data-reveal>
            <div className={styles.landing__notificationDemo}>
              <div className={styles.landing__phoneFrame}>
                <div className={styles.landing__phoneNotch} />
                <div className={styles.landing__phoneScreen}>
                  <div className={styles.landing__tgApp}>
                    <div className={styles.landing__tgStatusBar}>
                      <span className={styles.landing__tgStatusTime}>18:15</span>
                      <div className={styles.landing__tgStatusIcons} aria-hidden="true">
                        <span className={styles.landing__tgSignal} />
                        <span className={styles.landing__tgWifi} />
                        <span className={styles.landing__tgBattery} />
                      </div>
                    </div>
                    <div className={styles.landing__tgChatHeaderBar}>
                      <div className={styles.landing__tgChatLeft}>
                        <span className={styles.landing__tgBack}>‹</span>
                        <div className={styles.landing__tgAvatar}>K</div>
                      </div>
                      <div className={styles.landing__tgChatTitleWrap}>
                        <div className={styles.landing__tgChatTitle}>Kompass Alerts</div>
                        <div className={styles.landing__tgChatSubtitle}>bot • notifications</div>
                      </div>
                      <div className={styles.landing__tgChatRight} aria-hidden="true">
                        <span className={styles.landing__tgHeaderIcon}>🔍</span>
                        <span className={styles.landing__tgHeaderIcon}>⋮</span>
                  </div>
                    </div>

                    <div className={styles.landing__tgChatBody}>
                      {/* Telegram-style swap notification */}
                      <div className={styles.landing__tgMessage} style={{ animationDelay: '0s' }}>
                        <div className={styles.landing__tgHeader}>
                          <span className={styles.landing__tgBell}>🔔</span>
                          <span className={styles.landing__tgWalletLabel}>Wallet</span>
                          <span className={styles.landing__tgWalletName}>My Wallet</span>
                          <span className={styles.landing__tgAddress}>(0x157f...3988)</span>
                        </div>
                        <div className={styles.landing__tgSwapLine}>
                          <span className={styles.landing__tgSwapIcon}>🔄</span>
                          <span className={styles.landing__tgSwapText}>swapped</span>
                          <span className={styles.landing__tgAmount}>2000</span>
                          <span className={styles.landing__tgToken}>STRK</span>
                          <span className={styles.landing__tgSwapText}>for</span>
                          <span className={styles.landing__tgAmountReceived}>179228</span>
                          <span className={styles.landing__tgAddressSmall}>0x3fe2...e7ac</span>
                        </div>
                        <div className={styles.landing__tgBalanceSection}>
                          <div className={styles.landing__tgBalanceHeader}>
                            <span className={styles.landing__tgBalanceIcon}>💰</span>
                            <span>Balance Changes:</span>
                          </div>
                          <div className={styles.landing__tgBalanceRow}>
                            <span className={styles.landing__tgTokenName}>STRK</span>
                            <span className={styles.landing__tgBalanceNegative}>-2000</span>
                            <span className={styles.landing__tgSeparator}>|</span>
                            <span className={styles.landing__tgLink}>−</span>
                          </div>
                          <div className={styles.landing__tgBalanceRow}>
                            <span className={styles.landing__tgAddressToken}>0x3fe2...e7ac</span>
                            <span className={styles.landing__tgBalancePositive}>+179228</span>
                            <span className={styles.landing__tgSeparator}>|</span>
                            <span className={styles.landing__tgLink}>−</span>
                          </div>
                        </div>
                        <div className={styles.landing__tgActions}>
                          <button className={styles.landing__tgActionBtn}>
                            <span className={styles.landing__tgActionIcon}>🔄</span>
                            Swap STRK
                          </button>
                        </div>
                        <div className={styles.landing__tgFooterLinks}>
                          <a className={styles.landing__tgFooterLink}>
                            <span>💳</span>
                            Wallet
                            <span className={styles.landing__tgArrow}>↗</span>
                          </a>
                          <a className={styles.landing__tgFooterLink}>
                            <span>🔍</span>
                            Transaction
                            <span className={styles.landing__tgArrow}>↗</span>
                          </a>
                        </div>
                        <div className={styles.landing__tgMsgTime}>18:15</div>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.landing__cta}>
        <div className={`${styles.landing__ctaContent} ${styles.landing__reveal} ${styles.landing__revealUp}`} data-reveal>
          <h2 className={styles.landing__ctaTitle}>Get Notified on Launch</h2>
          <p className={styles.landing__ctaSubtitle}>
            Join the Telegram channel to get early access and launch updates.
          </p>
          <div className={styles.landing__ctaButtons}>
            <button className={styles.landing__ctaPrimary} onClick={handleLaunchApp}>
              <span className={styles.landing__ctaPrimaryBg} />
              <span className={styles.landing__ctaPrimaryText}>
                <span className={styles.landing__ctaPrimaryIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </span>
                Join Telegram — Early Access
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={styles.landing__footer}>
        <div className={styles.landing__footerGlow} />
        <div className={styles.landing__footerContent}>
          <div className={styles.landing__footerMain}>
            <div className={styles.landing__footerBrand}>
              <div className={styles.landing__footerLogoWrapper}>
                <img src={logoImage} alt="Kompass" className={styles.landing__footerLogo} />
                <div className={styles.landing__footerLogoGlow} />
              </div>
              <div className={styles.landing__footerBrandText}>
                <span className={styles.landing__footerLogoText}>Kompass Finance</span>
                <p className={styles.landing__footerTagline}>Your DeFi Command Center on Starknet</p>
              </div>
              <div className={styles.landing__footerSocials}>
                <a href="https://t.me/kompass_finance_bot" target="_blank" rel="noopener noreferrer" className={styles.landing__footerSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://x.com/kompassfinance" target="_blank" rel="noopener noreferrer" className={styles.landing__footerSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://discord.gg/sfDVKynHZc" target="_blank" rel="noopener noreferrer" className={styles.landing__footerSocialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className={styles.landing__footerLinks}>
              <div className={styles.landing__footerColumn}>
                <h4 className={styles.landing__footerColumnTitle}>Product</h4>
                <div className={styles.landing__footerColumnLinks}>
                  <a href="#features" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    Features
                  </a>
                  <a href="#how-it-works" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    How it works
                  </a>
                  <a onClick={handleLaunchApp} className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    Launch App
                  </a>
                </div>
              </div>
              <div className={styles.landing__footerColumn}>
                <h4 className={styles.landing__footerColumnTitle}>Community</h4>
                <div className={styles.landing__footerColumnLinks}>
                  <a href="https://t.me/kompass_finance_bot" target="_blank" rel="noopener noreferrer" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    Telegram
                  </a>
                  <a href="https://x.com/kompassfinance" target="_blank" rel="noopener noreferrer" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    X
                  </a>
                  <a href="https://discord.gg/sfDVKynHZc" target="_blank" rel="noopener noreferrer" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    Discord
                  </a>
                </div>
              </div>
              <div className={styles.landing__footerColumn}>
                <h4 className={styles.landing__footerColumnTitle}>Resources</h4>
                <div className={styles.landing__footerColumnLinks}>
                  <a href="https://docs.kompass.finance" target="_blank" rel="noopener noreferrer" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    Documentation
                  </a>
                  <a href="#" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    FAQ
                  </a>
                  <a href="#" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.landing__footerDivider} />
          
          <div className={styles.landing__footerBottom}>
            <p className={styles.landing__footerCopyright}>
              © 2025 Kompass Finance. All rights reserved.
            </p>
            <div className={styles.landing__footerBuiltWith}>
              <span>Built with</span>
              <span className={styles.landing__footerHeart}>❤️</span>
              <span>for the Starknet ecosystem</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
