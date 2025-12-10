# Kompass Finance - StarkNet Wallet Intelligence Dashboard

A real-time StarkNet wallet intelligence dashboard with gamified rewards layer.

## Tech Stack

- **React.js** with TypeScript
- **Vite** for build tooling
- **SCSS Modules** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Zustand** for state management
- **Recharts** for data visualization
- **Framer Motion** (optional) for animations

## Features

- 📊 Real-time wallet analytics
- 🔔 Live activity feed and notifications
- 💱 Token swap interface
- 📤 Send tokens functionality
- 🏦 DeFi positions tracking
- 🎁 Airdrop discovery and claims
- 💰 High-yield staking pools
- 🏆 Leaderboard system
- 🖼️ NFT discovery and alerts
- ⚙️ Comprehensive settings

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── store/           # Zustand stores
├── styles/           # SCSS styles
├── types/            # TypeScript types
├── utils/            # Utility functions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Pages

1. **Home Dashboard** - Overview with portfolio, quick actions, and activity feed
2. **Notifications** - Real-time wallet activity
3. **Portfolio** - Token holdings and PNL charts
4. **DeFi** - DeFi positions across protocols
5. **Swap** - Token swap interface
6. **Send** - Send tokens to addresses
7. **Address Book** - Saved contact addresses
8. **Transfers** - Transfer history
9. **Airdrops** - Eligible and upcoming airdrops
10. **Staking** - High-yield staking pools
11. **Leaderboard** - User rankings by Emeralds
12. **NFTs** - NFT discovery and floor price tracking
13. **Settings** - User preferences and wallet management

## Responsive Design

- **Mobile**: Bottom navigation bar, single column layout
- **Desktop**: Sidebar navigation, multi-column layouts
- Max width: 1280px on desktop

## API Integration

The app uses mock API services in `src/utils/api.ts`. Replace these with actual API endpoints when the backend is ready.

## State Management

- **Zustand**: UI state (modals, drawers, selections)
- **React Query**: Server state (portfolio, tokens, notifications)

## Styling

- SCSS Modules with BEM naming convention
- Dark theme by default
- Responsive breakpoints at 768px (mobile) and 1024px (tablet)

## License

MIT

# defi-dashboard
