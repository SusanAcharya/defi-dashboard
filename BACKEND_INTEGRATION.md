# Backend Integration Guide

## 📋 Overview

This guide explains how to integrate the Kompass Finance frontend with a backend API for real-time/live data. The frontend currently uses **mock data** and needs to be connected to actual backend endpoints.

---

## 🎯 What You Need to Know

### Current Setup
- **Data Fetching**: TanStack Query (React Query) - already configured ✅
- **API Layer**: Mock implementations in `src/utils/api.ts`
- **State Management**: Zustand for UI/wallet state
- **Real-time**: Not yet implemented

### What Needs to Change
1. Replace mock API calls with real HTTP requests
2. Add authentication/authorization
3. Implement real-time data updates (WebSockets/SSE)
4. Add error handling and retry logic
5. Configure API base URL and environment variables

---

## 📊 Complexity Assessment

| Task | Complexity | Time Estimate |
|------|-----------|---------------|
| Replace mock API calls | **Low** | 2-4 hours |
| Add authentication | **Medium** | 4-6 hours |
| Real-time data (WebSockets) | **Medium-High** | 8-12 hours |
| Error handling & retry | **Low-Medium** | 3-4 hours |
| Testing & debugging | **Medium** | 4-6 hours |
| **Total** | **Medium** | **21-32 hours** |

---

## 🚀 Step-by-Step Integration

### Step 1: Install Required Packages

```bash
npm install axios
# or if using fetch (already available in browser)
# No additional package needed
```

**Why**: For making HTTP requests to your backend API.

---

### Step 2: Create API Configuration

Create `src/config/api.ts`:

```typescript
// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// WebSocket Configuration
export const WS_CONFIG = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws',
  reconnectInterval: 5000, // 5 seconds
  maxReconnectAttempts: 10,
};
```

**Environment Variables** (`.env` file):
```env
VITE_API_BASE_URL=https://api.kompass.finance/api
VITE_WS_URL=wss://api.kompass.finance/ws
```

---

### Step 3: Create HTTP Client

Create `src/utils/httpClient.ts`:

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Add request interceptor for authentication
httpClient.interceptors.request.use(
  (config) => {
    // Get auth token from storage or state
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => response.data, // Return only data
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
```

---

### Step 4: Update API Service Layer

Update `src/utils/api.ts` - Replace mock functions with real API calls:

**Before (Mock):**
```typescript
async getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  await delay(500);
  return { /* mock data */ };
}
```

**After (Real API):**
```typescript
import httpClient from './httpClient';

async getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  const params = walletAddress ? { wallet: walletAddress } : {};
  return httpClient.get('/portfolio', { params });
}
```

**Example for all endpoints:**
```typescript
export const api = {
  // Portfolio
  async getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
    const params = walletAddress ? { wallet: walletAddress } : {};
    return httpClient.get('/portfolio', { params });
  },

  async getPortfolioChartData(
    walletAddress?: string | null, 
    timeframe: string = '30D'
  ): Promise<Array<{ date: string; value: number }>> {
    const params = {
      ...(walletAddress && { wallet: walletAddress }),
      timeframe,
    };
    return httpClient.get('/portfolio/chart', { params });
  },

  // Tokens
  async getTokens(walletAddress?: string | null): Promise<Token[]> {
    const params = walletAddress ? { wallet: walletAddress } : {};
    return httpClient.get('/tokens', { params });
  },

  // Activities
  async getActivities(): Promise<Activity[]> {
    return httpClient.get('/activities');
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return httpClient.get('/notifications');
  },

  // Add more endpoints as needed...
};
```

---

### Step 5: Real-Time Data Integration

#### Option A: WebSockets (Recommended for Live Updates)

Create `src/utils/websocket.ts`:

```typescript
import { WS_CONFIG } from '@/config/api';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    try {
      this.ws = new WebSocket(WS_CONFIG.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        // Send authentication token if needed
        const token = localStorage.getItem('authToken');
        if (token) {
          this.ws?.send(JSON.stringify({ type: 'auth', token }));
        }
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < WS_CONFIG.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, WS_CONFIG.reconnectInterval);
    }
  }

  private handleMessage(data: any) {
    // Notify all listeners for this event type
    const listeners = this.listeners.get(data.type);
    if (listeners) {
      listeners.forEach(callback => callback(data.payload));
    }
  }

  // Subscribe to events
  subscribe(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  // Send message to server
  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
  }
}

export const wsService = new WebSocketService();
```

#### Option B: Server-Sent Events (SSE) - Simpler Alternative

Create `src/utils/sse.ts`:

```typescript
class SSEService {
  private eventSource: EventSource | null = null;

  connect(url: string) {
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE connected');
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
  }

  on(event: string, callback: (data: any) => void) {
    this.eventSource?.addEventListener(event, (e: MessageEvent) => {
      callback(JSON.parse(e.data));
    });
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
  }
}

export const sseService = new SSEService();
```

#### Option C: Polling (Simplest, but less efficient)

Use TanStack Query's `refetchInterval`:

```typescript
const { data } = useQuery({
  queryKey: ['portfolio', walletAddress],
  queryFn: () => api.getPortfolio(walletAddress),
  refetchInterval: 5000, // Refetch every 5 seconds
});
```

---

### Step 6: Use Real-Time Data in Components

**Example: Portfolio with Real-Time Updates**

```typescript
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { wsService } from '@/utils/websocket';
import { api } from '@/utils/api';

export const Portfolio: React.FC = () => {
  const queryClient = useQueryClient();
  const { selectedWalletAddress } = useWalletStore();

  // Fetch initial data
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio', selectedWalletAddress],
    queryFn: () => api.getPortfolio(selectedWalletAddress),
  });

  // Subscribe to real-time updates
  useEffect(() => {
    // Connect WebSocket
    wsService.connect();

    // Subscribe to portfolio updates
    const unsubscribe = wsService.subscribe('portfolio-update', (data) => {
      // Update React Query cache with new data
      queryClient.setQueryData(['portfolio', selectedWalletAddress], data);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      wsService.disconnect();
    };
  }, [selectedWalletAddress, queryClient]);

  return (
    // Your component JSX
  );
};
```

---

### Step 7: Add Authentication

Create `src/utils/auth.ts`:

```typescript
import httpClient from './httpClient';

export const auth = {
  async login(email: string, password: string) {
    const response = await httpClient.post('/auth/login', { email, password });
    localStorage.setItem('authToken', response.token);
    return response;
  },

  async logout() {
    localStorage.removeItem('authToken');
    await httpClient.post('/auth/logout');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
};
```

---

### Step 8: Error Handling

Update `src/utils/api.ts` with error handling:

```typescript
import httpClient from './httpClient';

async getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  try {
    const params = walletAddress ? { wallet: walletAddress } : {};
    return await httpClient.get('/portfolio', { params });
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    throw error; // Let React Query handle retry
  }
}
```

**React Query Error Handling:**

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['portfolio', walletAddress],
  queryFn: () => api.getPortfolio(walletAddress),
  retry: 3, // Retry 3 times on failure
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error) => {
    // Show error toast/notification
    console.error('Portfolio fetch error:', error);
  },
});
```

---

## 🔄 Real-Time Data Strategy

### What Needs Real-Time Updates?

1. **Portfolio Values** - Update every 5-10 seconds
2. **Token Prices** - Update every 1-5 seconds
3. **Notifications** - Instant (push from server)
4. **Transaction Status** - Instant updates
5. **Chart Data** - Update every 30-60 seconds

### Implementation Priority

1. **High Priority** (WebSockets):
   - Portfolio values
   - Token prices
   - Notifications

2. **Medium Priority** (Polling):
   - Chart data
   - Activity feed

3. **Low Priority** (On-demand):
   - Historical data
   - Settings

---

## 📝 Backend API Requirements

### Expected Endpoints

Your backend should provide:

```
GET  /api/portfolio?wallet=<address>
GET  /api/portfolio/chart?wallet=<address>&timeframe=<30D>
GET  /api/tokens?wallet=<address>
GET  /api/activities
GET  /api/notifications
GET  /api/defi/positions
GET  /api/explore/pools
GET  /api/explore/lending
GET  /api/explore/staking
POST /api/swap/quote
POST /api/auth/login
POST /api/auth/logout
```

### WebSocket Events

Your backend should emit:

```javascript
{
  type: 'portfolio-update',
  payload: { /* portfolio data */ }
}

{
  type: 'token-price-update',
  payload: { symbol: 'STRK', price: 1.25 }
}

{
  type: 'notification',
  payload: { /* notification data */ }
}
```

---

## ✅ Checklist

- [ ] Install axios (or use fetch)
- [ ] Create API configuration file
- [ ] Create HTTP client with interceptors
- [ ] Replace all mock API calls in `api.ts`
- [ ] Add environment variables for API URLs
- [ ] Implement WebSocket/SSE service
- [ ] Add real-time subscriptions in components
- [ ] Add authentication flow
- [ ] Add error handling and retry logic
- [ ] Test all endpoints
- [ ] Test real-time updates
- [ ] Add loading states
- [ ] Add error states/UI
- [ ] Update environment variables for production

---

## 🎓 Best Practices

1. **Use React Query** - Already set up, handles caching, refetching, etc.
2. **Error Boundaries** - Wrap components to catch errors gracefully
3. **Loading States** - Show skeletons/loaders while fetching
4. **Optimistic Updates** - Update UI immediately, sync with server later
5. **Debounce** - For search/filter inputs
6. **Pagination** - For large lists (activities, transactions)
7. **Rate Limiting** - Respect backend rate limits
8. **Token Refresh** - Implement automatic token refresh

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Backend needs to allow your frontend origin in CORS headers

### Issue: WebSocket Connection Fails
**Solution**: Check WebSocket URL, ensure backend supports WS/WSS

### Issue: Authentication Token Expired
**Solution**: Implement token refresh in HTTP interceptor

### Issue: Too Many API Calls
**Solution**: Use React Query's caching, increase `staleTime`

### Issue: Real-Time Updates Not Working
**Solution**: Check WebSocket connection, verify event types match

---

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [React Query + WebSockets](https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching)

---

## 🚦 Quick Start (TL;DR)

1. **Install**: `npm install axios`
2. **Create**: `src/config/api.ts` with base URL
3. **Create**: `src/utils/httpClient.ts` with axios instance
4. **Update**: Replace mock functions in `src/utils/api.ts` with real HTTP calls
5. **Add**: `.env` file with `VITE_API_BASE_URL`
6. **Test**: One endpoint at a time
7. **Add**: WebSocket for real-time (optional but recommended)

**That's it!** The React Query setup is already done, so you just need to replace the mock data with real API calls.

---

**Need Help?** Check the backend repo documentation for exact endpoint specifications and authentication requirements.

