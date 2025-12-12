import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout, WalletConnectModal, AnimatedBackground } from './components';
import {
  Home,
  Notifications,
  Portfolio,
  DeFi,
  Swap,
  Send,
  AddressBook,
  Transfers,
  Airdrops,
  Staking,
  Leaderboard,
  NFTs,
  Settings,
  Wallet,
} from './pages';
import './styles/index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <AnimatedBackground />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/defi" element={<DeFi />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/send" element={<Send />} />
            <Route path="/address-book" element={<AddressBook />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/airdrops" element={<Airdrops />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/nfts" element={<NFTs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </Layout>
        <WalletConnectModal />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

