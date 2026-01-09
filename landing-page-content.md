# Kompass Finance Landing Page - Content Documentation

This document maps all text content on the landing page, organized by section and component location.

---

## Header / Navigation

**Location:** `src/pages/Landing/Landing.tsx` - Header component (lines 161-205)

### Logo Section
- **Brand Name:** "Kompass"
- **Sub-brand:** "Finance"
- **Component:** `landing__logoText` / `landing__logoSubtext`

### Navigation Links
- **Features** - Links to `#features` section
- **About** - Links to `#about` section  
- **Community** - External link to Telegram bot

### Header Actions
- **Get Early Access** button - Opens Telegram bot
- **Social Icons:** Telegram, X/Twitter (no text labels)

---

## Hero Section

**Location:** `src/pages/Landing/Landing.tsx` - Hero section (lines 208-310)

### Badge
- **Text:** "⚡ Built for Starknet"
- **Component:** `landing__badge`

### Main Heading
- **Text:** "Your Complete **DeFi Command Center** on Starknet"
- **Highlighted portion:** "DeFi Command Center"
- **Component:** `landing__title` / `landing__titleHighlight`

### Subtitle
- **Text:** "Kompass is launching soon — a Telegram-first DeFi companion for Starknet. Get instant wallet alerts, portfolio insights, and opportunity discovery from day one."
- **Component:** `landing__subtitle`

### Call-to-Action Buttons
1. **Primary Button:**
   - **Icon:** 📱
   - **Text:** "Join Telegram (Early Access)"
   - **Action:** Opens Telegram bot
   - **Component:** `landing__primaryButton`

2. **Secondary Button:**
   - **Icon:** 🌐
   - **Text:** "See How It Works"
   - **Action:** Scrolls to `#about` section
   - **Component:** `landing__secondaryButton`

### Stats Section
**Location:** `stats` array (lines 38-43)

1. **Value:** "Soon" | **Label:** "Early Access"
2. **Value:** "Telegram" | **Label:** "First Experience"
3. **Value:** "Starknet" | **Label:** "Native Focus"
4. **Value:** "Non-custodial" | **Label:** "Always"

**Component:** `landing__heroStats` / `landing__stat`

### Terminal Visual (Hero)
**Location:** Terminal mockup in hero visual (lines 243-308)

#### Terminal Top Bar
- **Title:** "KOMPASS // OPS"
- **Status:** "live" (with red dot indicator)
- **Component:** `landing__terminalTitle` / `landing__terminalStatus`

#### Intel Cards (Terminal Body)

**Card 1 - ALERT:**
- **Tag:** "ALERT"
- **Time:** "NOW"
- **Key:** "Health"
- **Value:** "1.52×"
- **Subtext:** "Add collateral to stay safe."
- **Component:** `landing__intelCard` (data-tone="danger")

**Card 2 - WALLET:**
- **Tag:** "WALLET"
- **Time:** "18:15"
- **Address:** "0x157f...3988"
- **Subtext:** "Connected • Watching 100+ protocols"
- **Component:** `landing__intelCard` (data-tone="neon")

**Card 3 - TX:**
- **Tag:** "TX"
- **Time:** "2m"
- **Transaction:** "swap +179228 0x3fe2…e7ac"
- **Subtext:** "Telegram pings in real time."
- **Component:** `landing__intelCard` (data-tone="cool")

---

## Token Ticker Section

**Location:** `src/pages/Landing/Landing.tsx` - Token ticker (lines 312-329)

### Header
- **Kicker:** "Tracked tokens"
- **Hint:** "…and more Starknet assets"
- **Component:** `landing__tokenTickerHeader`

### Token List
**Location:** `tokenTape` array (lines 68-77)

1. **ETH** - Ether
2. **STRK** - Starknet
3. **USDC** - USD Coin
4. **USDT** - Tether
5. **wBTC** - Wrapped Bitcoin
6. **DAI** - Dai
7. **EKUBO** - Ekubo
8. **LORDS** - Realms

**Component:** `landing__tokenPill` (displays symbol + name)

---

## Features Section

**Location:** `src/pages/Landing/Landing.tsx` - Features section (lines 331-353)

### Section Header
- **Badge:** "✨ Features"
- **Title:** "Everything You Need"
- **Subtitle:** "Comprehensive tools designed for the Starknet community"
- **Component:** `landing__sectionHeader`

### Feature Cards
**Location:** `features` array (lines 5-36)

1. **📊 Portfolio Tracking**
   - "Aggregate all your Starknet wallets into one unified dashboard. Track balances, DeFi positions, and NFTs in real-time."

2. **🔔 Smart Alerts**
   - "Never miss important wallet activity. Get instant notifications for transactions, airdrops, and protocol updates."

3. **💰 DeFi Insights**
   - "Monitor your lending positions, LP rewards, and protocol exposure. Stay ahead with actionable analytics."

4. **🛡️ Risk Management**
   - "Track debt ratios and get liquidation warnings. Protect your positions with customizable alert thresholds."

5. **📈 Market Data**
   - "Access real-time price charts, token analytics, and market trends for the Starknet ecosystem."

6. **🎯 Opportunity Discovery**
   - "Explore high-yield pools, lending options, and staking strategies. Find the best opportunities on Starknet."

**Component:** `landing__featureCard` / `landing__featureTitle` / `landing__featureDescription`

---

## About / Mission Section

**Location:** `src/pages/Landing/Landing.tsx` - About section (lines 355-490)

### Section Header
- **Badge:** "🎯 Our Mission"
- **Title:** "Bridging Users & Protocols **on Starknet**"
- **Highlighted portion:** "on Starknet"
- **Subtitle:** "We're building the ultimate DeFi companion. Our platform delivers seamless communication between you and the protocols you use, ensuring you never miss an opportunity."
- **Component:** `landing__aboutHeader`

### Dossier Overlay (Decorative)
- **Stamp:** "CONFIDENTIAL"
- **Meta:** "CASE KMP-021 • STATUS OPEN"
- **Component:** `landing__dossierOverlay` (aria-hidden="true")

### Mission Points
**Location:** `missionPoints` array (lines 45-66)

1. **🔗 Seamless Integration**
   - "Deep protocol connections for real-time data"

2. **⚡ Lightning Fast**
   - "Instant alerts and live portfolio updates"

3. **🔒 Non-Custodial**
   - "Your keys, your crypto — always"

4. **💎 Free Forever**
   - "No hidden fees or premium tiers"

**Component:** `landing__missionCard` / `landing__missionTitle` / `landing__missionDescription`

### Phone Mockup (Telegram Notification Demo)
**Location:** Phone frame demo (lines 398-488)

#### Status Bar
- **Time:** "18:15"
- **Icons:** Signal, WiFi, Battery indicators

#### Chat Header
- **Back button:** "‹"
- **Avatar:** "K"
- **Title:** "Kompass Alerts"
- **Subtitle:** "bot • notifications"
- **Icons:** 🔍 ⋮

#### Telegram Message Content
- **Header:** "🔔 Wallet My Wallet (0x157f...3988)"
- **Swap Line:** "🔄 swapped 2000 STRK for 179228 0x3fe2...e7ac"
- **Balance Changes:**
  - "STRK -2000 | −"
  - "0x3fe2...e7ac +179228 | −"
- **Actions:** "🔄 Swap STRK" button
- **Footer Links:**
  - "💳 Wallet ↗"
  - "🔍 Transaction ↗"
- **Timestamp:** "18:15"

**Component:** `landing__phoneFrame` / `landing__phoneScreen` / `landing__tgApp`

---

## CTA Section

**Location:** `src/pages/Landing/Landing.tsx` - CTA section (lines 492-505)

### Content
- **Title:** "Get Notified on Launch"
- **Subtitle:** "Join the Telegram channel to get early access and launch updates."
- **Button:** "Join Telegram — Early Access"
- **Action:** Opens Telegram bot

**Component:** `landing__cta` / `landing__ctaContent` / `landing__ctaPrimary`

---

## Footer

**Location:** `src/pages/Landing/Landing.tsx` - Footer (lines 507-608)

### Brand Section
- **Logo:** Kompass logo image
- **Brand Name:** "Kompass Finance"
- **Tagline:** "Your DeFi Command Center on Starknet"
- **Social Links:** Telegram, X/Twitter, Discord (icon-only)

**Component:** `landing__footerBrand` / `landing__footerLogoText` / `landing__footerTagline`

### Footer Links

#### Product Column
- **Title:** "Product"
- **Links:**
  - Features (links to `#features`)
  - About (links to `#about`)
  - Launch App (opens Telegram bot)

#### Community Column
- **Title:** "Community"
- **Links:**
  - Telegram (external: https://t.me/kompass_finance_bot)
  - X (external: https://x.com/kompassfinance)
  - Discord (external: https://discord.gg/sfDVKynHZc)

#### Resources Column
- **Title:** "Resources"
- **Links:**
  - Documentation (placeholder: `#`)
  - FAQ (placeholder: `#`)
  - Support (placeholder: `#`)

**Component:** `landing__footerLinks` / `landing__footerColumn` / `landing__footerLink`

### Footer Bottom
- **Copyright:** "© 2025 Kompass Finance. All rights reserved."
- **Built With:** "Built with ❤️ for the Starknet ecosystem"

**Component:** `landing__footerBottom` / `landing__footerCopyright` / `landing__footerBuiltWith`

---

## Back-to-Top Button

**Location:** `src/pages/Landing/Landing.tsx` - Floating button (lines 154-158)

- **Icon:** "↑" (arrow only, no text)
- **Position:** Bottom-right corner
- **Visibility:** Appears when `scrollY > 650`
- **Action:** Smooth scroll to top

**Component:** `landing__toTop` / `landing__toTopIcon`

---

## External Links Reference

### Telegram
- **Bot Link:** https://t.me/kompass_finance_bot
- **Used in:** Header button, Hero CTA, Footer links, Navigation

### X/Twitter
- **Link:** https://x.com/kompassfinance
- **Used in:** Header social icon, Footer social icon, Footer links

### Discord
- **Link:** https://discord.gg/sfDVKynHZc
- **Used in:** Footer social icon, Footer links

---

## Content Arrays Reference

### `features` Array (Lines 5-36)
Contains 6 feature objects with `icon`, `title`, and `description`

### `stats` Array (Lines 38-43)
Contains 4 stat objects with `value` and `label`

### `missionPoints` Array (Lines 45-66)
Contains 4 mission point objects with `icon`, `title`, and `description`

### `tokenTape` Array (Lines 68-77)
Contains 8 token objects with `symbol` and `name`

---

## Notes

- All text content is in English
- Pre-launch messaging emphasizes "early access" and "launching soon"
- Focus on Telegram as primary interface
- Starknet ecosystem emphasis throughout
- Non-custodial and free messaging highlighted
- Noir/terminal aesthetic reflected in terminal mockup content

