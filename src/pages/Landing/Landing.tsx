import React, { useEffect, useState } from 'react';
import logoImage from '@/assets/logo.png';
import styles from './Landing.module.scss';

const features = [
  {
    icon: '📊',
    title: 'Portfolio Tracking',
    description: 'Aggregate all your Starknet wallets into one unified dashboard. Track balances, DeFi positions, and NFTs in real-time.',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    description: 'Never miss important wallet activity. Get instant notifications for transactions, airdrops, and protocol updates.',
  },
  {
    icon: '💰',
    title: 'DeFi Insights',
    description: 'Monitor your lending positions, LP rewards, and protocol exposure. Stay ahead with actionable analytics.',
  },
  {
    icon: '🛡️',
    title: 'Risk Management',
    description: 'Track debt ratios and get liquidation warnings. Protect your positions with customizable alert thresholds.',
  },
  {
    icon: '📈',
    title: 'Market Data',
    description: 'Access real-time price charts, token analytics, and market trends for the Starknet ecosystem.',
  },
  {
    icon: '🎯',
    title: 'Opportunity Discovery',
    description: 'Explore high-yield pools, lending options, and staking strategies. Find the best opportunities on Starknet.',
  },
];

const stats = [
  { value: 'Soon', label: 'Early Access' },
  { value: 'Telegram', label: 'First Experience' },
  { value: 'Starknet', label: 'Native Focus' },
  { value: 'Non-custodial', label: 'Always' },
];

const missionPoints = [
  {
    icon: '🔗',
    title: 'Seamless Integration',
    description: 'Deep protocol connections for real-time data',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Instant alerts and live portfolio updates',
  },
  {
    icon: '🔒',
    title: 'Non-Custodial',
    description: 'Your keys, your crypto — always',
  },
  {
    icon: '💎',
    title: 'Free Forever',
    description: 'No hidden fees or premium tiers',
  },
];

export const Landing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setHeaderScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchApp = () => {
    window.open('https://t.me/kompass_finance_bot', '_blank', 'noopener,noreferrer');
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.landing}>
      {/* Animated Background */}
      <div className={styles.landing__bgEffects}>
        <div className={styles.landing__orb1} />
        <div className={styles.landing__orb2} />
        <div className={styles.landing__orb3} />
        <div className={styles.landing__grid} />
        <div className={styles.landing__stars} />
        <div className={styles.landing__noise} />
        <div className={styles.landing__scanlines} />
        <div className={styles.landing__vignette} />
      </div>

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
            <a href="#about" className={styles.landing__navLink}>
              <span className={styles.landing__navLinkText}>About</span>
              <span className={styles.landing__navLinkLine} />
            </a>
            <a href="https://t.me/kompass_finance_bot" target="_blank" rel="noopener noreferrer" className={styles.landing__navLink}>
              <span className={styles.landing__navLinkText}>Community</span>
              <span className={styles.landing__navLinkLine} />
            </a>
          </nav>
          <div className={styles.landing__headerActions}>
            <a href="https://t.me/kompass_finance_bot" target="_blank" rel="noopener noreferrer" className={styles.landing__socialIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a href="https://x.com/kompassfinance" target="_blank" rel="noopener noreferrer" className={styles.landing__socialIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <button className={styles.landing__launchButton} onClick={handleLaunchApp}>
              <span className={styles.landing__launchButtonBg} />
              <span className={styles.landing__launchButtonText}>
                <span className={styles.landing__launchIcon}>🕵️</span>
                Get Early Access
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`${styles.landing__hero} ${isVisible ? styles.landing__hero_visible : ''}`}>
        <div className={styles.landing__heroContent}>
          <div className={styles.landing__badge}>
            <span className={styles.landing__badgeIcon}>⚡</span>
            Built for Starknet
          </div>
          <h1 className={styles.landing__title}>
            Your Complete
            <span className={styles.landing__titleHighlight}> DeFi Command Center </span>
            on Starknet
          </h1>
          <p className={styles.landing__subtitle}>
            Kompass is launching soon — a Telegram-first DeFi companion for Starknet.
            Get instant wallet alerts, portfolio insights, and opportunity discovery from day one.
          </p>
          <div className={styles.landing__heroCTA}>
            <button className={styles.landing__primaryButton} onClick={handleLaunchApp}>
              <span className={styles.landing__buttonIcon}>📱</span>
              Join Telegram (Early Access)
            </button>
            <button className={styles.landing__secondaryButton} onClick={() => scrollToId('about')}>
              <span className={styles.landing__buttonIcon}>🌐</span>
              See How It Works
            </button>
          </div>
          <div className={styles.landing__heroStats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.landing__stat} style={{ animationDelay: `${0.1 * index}s` }}>
                <div className={styles.landing__statValue}>{stat.value}</div>
                <div className={styles.landing__statLabel}>{stat.label}</div>
              </div>
            ))}
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

      {/* Features Section */}
      <section id="features" className={styles.landing__features}>
        <div className={styles.landing__sectionHeader}>
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
              className={styles.landing__featureCard}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className={styles.landing__featureIcon}>{feature.icon}</div>
              <h3 className={styles.landing__featureTitle}>{feature.title}</h3>
              <p className={styles.landing__featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced About/Mission Section */}
      <section id="about" className={styles.landing__about}>
        <div className={styles.landing__aboutBg}>
          <div className={styles.landing__aboutOrb1} />
          <div className={styles.landing__aboutOrb2} />
        </div>
        <div className={styles.landing__aboutContainer}>
          {/* Subtle dossier vibe */}
          <div className={styles.landing__dossierOverlay} aria-hidden="true">
            <div className={styles.landing__dossierStamp}>CONFIDENTIAL</div>
            <div className={styles.landing__dossierMeta}>
              <span className={styles.landing__dossierMetaKey}>CASE</span>
              <span className={styles.landing__dossierMetaValue}>KMP-021</span>
              <span className={styles.landing__dossierMetaDot}>•</span>
              <span className={styles.landing__dossierMetaKey}>STATUS</span>
              <span className={styles.landing__dossierMetaValue}>OPEN</span>
            </div>
          </div>
          <div className={styles.landing__aboutHeader}>
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
              <div key={index} className={styles.landing__missionCard} style={{ animationDelay: `${0.1 * index}s` }}>
                <div className={styles.landing__missionIconWrapper}>
                  <span className={styles.landing__missionIcon}>{point.icon}</span>
                  <div className={styles.landing__missionIconGlow} />
                </div>
                <h3 className={styles.landing__missionTitle}>{point.title}</h3>
                <p className={styles.landing__missionDescription}>{point.description}</p>
              </div>
            ))}
          </div>

          <div className={styles.landing__aboutVisual}>
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
        <div className={styles.landing__ctaContent}>
          <h2 className={styles.landing__ctaTitle}>Get Notified on Launch</h2>
          <p className={styles.landing__ctaSubtitle}>
            Join the Telegram channel to get early access and launch updates.
          </p>
          <div className={styles.landing__ctaButtons}>
            <button className={styles.landing__ctaPrimary} onClick={handleLaunchApp}>
              Join Telegram — Early Access
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
                  <a href="#about" className={styles.landing__footerLink}>
                    <span className={styles.landing__footerLinkDot} />
                    About
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
                  <a href="#" className={styles.landing__footerLink}>
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
