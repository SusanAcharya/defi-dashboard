import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../Card/Card';
import { Toast } from '../Toast/Toast';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { Token } from '@/types';
import styles from './PriceChart.module.scss';

const ITEMS_PER_PAGE = 20;

export const PriceChart: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'top-gainers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);
  
  const { data: tokens } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => api.getTokens(),
  });

  // Filter and sort tokens
  const processedTokens = useMemo(() => {
    if (!tokens) return [];
    
    let filtered = tokens;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.address?.toLowerCase().includes(query)
      );
    }
    
    // Apply top gainers filter
    if (filter === 'top-gainers') {
      filtered = filtered.filter(token => token.change24h > 0);
      filtered.sort((a, b) => b.change24h - a.change24h);
    } else {
      // Sort by market cap (usdValue) for "all"
      filtered.sort((a, b) => b.usdValue - a.usdValue);
    }
    
    return filtered;
  }, [tokens, filter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(processedTokens.length / ITEMS_PER_PAGE);
  const paginatedTokens = processedTokens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get liquidity
  const getLiquidity = (token: Token): number => {
    return token.liquidity || 0;
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage('Contract address copied to clipboard');
    setShowToast(true);
  };

  return (
    <Card title="MARKET PRICES" className={styles.priceChart}>
      <div className={styles.priceChart__header}>
        <div className={styles.priceChart__search}>
          <span className={styles.priceChart__searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.priceChart__searchInput}
          />
        </div>
        <div className={styles.priceChart__controls}>
          <div className={styles.priceChart__filters}>
            <button
              className={`${styles.priceChart__filter} ${filter === 'all' ? styles.priceChart__filter_active : ''}`}
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
            >
              All
            </button>
            <button
              className={`${styles.priceChart__filter} ${filter === 'top-gainers' ? styles.priceChart__filter_active : ''}`}
              onClick={() => {
                setFilter('top-gainers');
                setCurrentPage(1);
              }}
            >
              Top Gainers [24 hr]
            </button>
          </div>
          <div className={styles.priceChart__pagination}>
            <span className={styles.priceChart__pageInfo}>
              Page {currentPage}/{totalPages || 1}
            </span>
            <button
              className={styles.priceChart__pageButton}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              ««
            </button>
            <button
              className={styles.priceChart__pageButton}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button
              className={styles.priceChart__pageButton}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              »
            </button>
            <button
              className={styles.priceChart__pageButton}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
            >
              »»
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.priceChart__tableWrapper}>
        <table className={styles.priceChart__table}>
          <thead>
            <tr className={styles.priceChart__tableHeader}>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h</th>
              <th>Market Cap</th>
              <th>Liqui</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTokens.map((token, index) => {
              const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              const liquidity = getLiquidity(token);
              
              return (
                <tr 
                  key={token.id} 
                  className={styles.priceChart__tableRow}
                  onClick={() => navigate(`/token/${token.id}`)}
                >
                  <td className={styles.priceChart__rank}>{rank}</td>
                  <td>
                    <div className={styles.priceChart__coin}>
                      <div className={styles.priceChart__coinIcon}>{token.symbol[0]}</div>
                      <div className={styles.priceChart__coinInfo}>
                        <div className={styles.priceChart__coinNameRow}>
                          <span className={styles.priceChart__coinName}>{token.name}</span>
                          <span className={styles.priceChart__verified}>✓</span>
                        </div>
                        <div className={styles.priceChart__coinDetails}>
                          <span className={styles.priceChart__coinSymbol}>{token.symbol}</span>
                          {token.address && (
                            <button
                              className={styles.priceChart__copyButton}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click navigation
                                handleCopyAddress(token.address || '');
                              }}
                              aria-label="Copy address"
                              title="Copy contract address"
                            >
                              📋
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.priceChart__price}>
                    {showFinancialNumbers ? `$ ${token.price.toFixed(4)}` : '••••'}
                  </td>
                  <td className={`${styles.priceChart__change} ${token.change24h >= 0 ? styles.priceChart__change_positive : styles.priceChart__change_negative}`}>
                    {showFinancialNumbers 
                      ? `${formatPercentage(token.change24h, 2, true)}${token.change24h >= 0 ? ' ↑' : ' ↓'}`
                      : '•••'
                    }
                  </td>
                  <td className={styles.priceChart__marketCap}>
                    {showFinancialNumbers 
                      ? formatCurrency(token.usdValue, 'USD', true).replace('$', '$ ')
                      : '••••'
                    }
                  </td>
                  <td className={styles.priceChart__liquidity}>
                    {showFinancialNumbers 
                      ? formatCurrency(liquidity, 'USD', true).replace('$', '$ ')
                      : '••••'
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          duration={3000}
          onClose={handleCloseToast}
        />
      )}
    </Card>
  );
};

