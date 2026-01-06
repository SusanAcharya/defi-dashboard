import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout, AnimatedBackground, TelegramConnectModal } from "./components";
import {
  Home,
  Portfolio,
  Settings,
  Profile,
  Wallet,
  Explore,
  PoolDetail,
  LiveChart,
  History,
  TokenDetail,
} from "./pages";
import { useTelegramAuth } from "./hooks/useTelegramAuth";
import "./styles/index.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { loading } = useTelegramAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AnimatedBackground />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/pool/:poolId" element={<PoolDetail />} />
          <Route path="/live-chart" element={<LiveChart />} />
          <Route path="/history" element={<History />} />
          <Route path="/token/:tokenId" element={<TokenDetail />} />
        </Routes>
      </Layout>
      <TelegramConnectModal />
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
