import { useEffect, useState } from 'react';
import { apiClient } from '../services/client';

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
}

interface TelegramWebApp {
  ready: () => void;
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  expand: () => void;
  close: () => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
  requestWriteAccess: (callback?: (ok: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

interface UseTelegramAuthReturn {
  user: TelegramUser | null;
  loading: boolean;
  error: string | null;
  isInTelegram: boolean;
  isTelegramReady: boolean;
}

export const useTelegramAuth = (): UseTelegramAuthReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (!window.Telegram?.WebApp) {
      console.warn(
        'Telegram WebApp not available. App is running outside Telegram.'
      );
      setLoading(false);
      return;
    }

    setIsInTelegram(true);
    const tg = window.Telegram.WebApp;

    try {
      // Signal that the app is ready
      tg.ready();
      setIsTelegramReady(true);

      // Get user data from Telegram
      const userData = tg.initDataUnsafe?.user;

      if (!userData) {
        setError('No user data from Telegram');
        setLoading(false);
        return;
      }

      // Get the raw initData for backend verification
      const initDataRaw = tg.initData;

      // Send to backend for verification
      verifyTelegramAuth(initDataRaw, userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Telegram initialization error: ${errorMessage}`);
      setLoading(false);
    }
  }, []);

  const verifyTelegramAuth = async (
    initDataRaw: string,
    userData: TelegramUser
  ) => {
    try {
      // Parse initData query string into object
      const params = new URLSearchParams(initDataRaw);
      const initDataObj: any = {
        hash: params.get('hash') || '',
        auth_date: params.get('auth_date') ? parseInt(params.get('auth_date')!, 10) : undefined,
        query_id: params.get('query_id') || undefined,
        start_param: params.get('start_param') || undefined,
      };

      // Add user object if available
      if (userData) {
        initDataObj.user = userData;
      }

      const response = await apiClient.post('/telegram/verify', {
        initData: initDataObj,
      });

      const data = response as any;
      if (data.success) {
        setUser(userData);
        // Store the telegram ID in localStorage for future use
        localStorage.setItem('telegramUserId', userData.id.toString());
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Telegram verification error:', errorMessage);
      // Even if verification fails, we can still use the app with local user data
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isInTelegram,
    isTelegramReady,
  };
};
