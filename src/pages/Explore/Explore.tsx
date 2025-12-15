import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components';
import styles from './Explore.module.scss';

const hotBowlCategories = [
  { id: 'high-apr', label: 'High APR', icon: '🚀' },
  { id: 'stablecoin', label: 'Stablecoin', icon: '🐢' },
  { id: 'blue-chip', label: 'Blue-chips', icon: '💎' },
  { id: 'memecoin', label: 'Memecoins', icon: '🔥' },
];

const exploreTabs = ['Pools', 'Lending', 'Staking'];

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pools');
  const [selectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('Protocols');
  const [selectedPoolType, setSelectedPoolType] = useState('All Pool Types');
  const [selectedAssetType, setSelectedAssetType] = useState('All Asset Types');
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);

  const { data: hotBowls } = useQuery({
    queryKey: ['hot-bowls', selectedCategory],
    queryFn: () => api.getHotBowls(selectedCategory || undefined),
  });

  const { data: pools } = useQuery({
    queryKey: ['liquidity-pools'],
    queryFn: api.getLiquidityPools,
  });

  const { data: lendingOptions } = useQuery({
    queryKey: ['lending-options'],
    queryFn: api.getLendingOptions,
  });

  const { data: strategies } = useQuery({
    queryKey: ['staking-strategies'],
    queryFn: api.getStakingStrategies,
  });

  const getCategoryBowls = (category: string) => {
    return hotBowls?.filter(bowl => bowl.category === category).slice(0, 5) || [];
  };

  const getRiskBars = (risk: 'low' | 'medium' | 'high') => {
    const count = risk === 'low' ? 3 : risk === 'medium' ? 4 : 4;
    const color = risk === 'low' ? '#10b981' : '#f59e0b';
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className={styles.riskBar} style={{ backgroundColor: color }} />
    ));
  };

  // Filter pools
  const filteredPools = useMemo(() => {
    if (!pools) return [];
    return pools.filter(pool => {
      const matchesSearch = !searchQuery || 
        pool.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.protocol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProtocol = selectedProtocol === 'Protocols' || pool.protocol === selectedProtocol;
      const matchesPoolType = selectedPoolType === 'All Pool Types' || pool.poolType === selectedPoolType;
      const matchesAssetType = selectedAssetType === 'All Asset Types' || 
        (selectedAssetType === 'Stablecoin' && (pool.pair.includes('USDC') || pool.pair.includes('USDT'))) ||
        (selectedAssetType === 'Blue-chip' && (pool.pair.includes('ETH') || pool.pair.includes('STRK')));
      return matchesSearch && matchesProtocol && matchesPoolType && matchesAssetType;
    });
  }, [pools, searchQuery, selectedProtocol, selectedPoolType, selectedAssetType]);

  // Filter lending options
  const filteredLending = useMemo(() => {
    if (!lendingOptions) return [];
    return lendingOptions.filter(option => {
      const matchesSearch = !searchQuery ||
        option.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.token.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [lendingOptions, searchQuery]);

  // Filter strategies
  const filteredStrategies = useMemo(() => {
    if (!strategies) return [];
    return strategies.filter(strategy => {
      const matchesSearch = !searchQuery ||
        strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [strategies, searchQuery]);

  return (
    <div className={styles.explore}>
      {/* Hot Bowls Section */}
      <Card title="🔥 Hot Bowls" className={styles.explore__hotBowls}>
        <div className={styles.hotBowls}>
          {hotBowlCategories.map((category) => {
            const bowls = getCategoryBowls(category.id);
            return (
              <div key={category.id} className={styles.hotBowls__category}>
                <div className={styles.hotBowls__categoryHeader}>
                  <div className={styles.hotBowls__categoryTitle}>
                    <span className={styles.hotBowls__categoryIcon}>{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                  <button className={styles.hotBowls__viewAll}>View all &gt;</button>
                </div>
                <div className={styles.hotBowls__list}>
                  {bowls.map((bowl) => (
                    <div key={bowl.id} className={styles.hotBowls__item}>
                      <span className={styles.hotBowls__pair}>{bowl.pair}</span>
                      <span className={styles.hotBowls__apr}>
                        {formatPercentage(bowl.apr, 2, showFinancialNumbers)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Explore Section */}
      <Card title="⭐ Liquidity Pools" className={styles.explore__main}>
        {/* Tabs */}
        <div className={styles.explore__tabs}>
          {exploreTabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.explore__tab} ${
                activeTab === tab ? styles.explore__tab_active : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className={styles.explore__filters}>
          <div className={styles.explore__search}>
            <span className={styles.explore__searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Filter by coins"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.explore__searchInput}
            />
            <button className={styles.explore__settingsIcon}>⚙️</button>
          </div>
          <div className={styles.explore__filterDropdowns}>
            <select 
              className={styles.explore__filter}
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
            >
              <option>Protocols</option>
              <option>JediSwap</option>
              <option>10KSwap</option>
              <option>Ekubo</option>
            </select>
            <select 
              className={styles.explore__filter}
              value={selectedPoolType}
              onChange={(e) => setSelectedPoolType(e.target.value)}
            >
              <option>All Pool Types</option>
              <option>CLMM</option>
              <option>DLMM</option>
            </select>
            <select 
              className={styles.explore__filter}
              value={selectedAssetType}
              onChange={(e) => setSelectedAssetType(e.target.value)}
            >
              <option>All Asset Types</option>
              <option>Stablecoin</option>
              <option>Blue-chip</option>
            </select>
          </div>
        </div>

        {/* Pools Table */}
        {activeTab === 'Pools' && (
          <div className={styles.explore__tableWrapper}>
            <table className={styles.explore__table}>
              <thead>
                <tr>
                  <th>Pool</th>
                  <th>TVL</th>
                  <th>24H 7D Volume</th>
                  <th>24H 7D Fee</th>
                  <th>24H 7D APR</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {filteredPools.map((pool) => (
                  <tr 
                    key={pool.id}
                    className={styles.explore__tableRow}
                    onClick={() => navigate(`/pool/${pool.id}`)}
                  >
                    <td>
                      <div className={styles.explore__poolInfo}>
                        <span className={styles.explore__star}>⭐</span>
                        <div>
                          <div className={styles.explore__poolName}>
                            {pool.pair}
                            {pool.verified && <span className={styles.explore__verified}>✓</span>}
                            {pool.hasRewards && <span className={styles.explore__gift}>🎁</span>}
                          </div>
                          <div className={styles.explore__poolDetails}>
                            {pool.protocol} {pool.poolType} {pool.fee}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{formatCurrency(pool.tvl, 'USD', showFinancialNumbers)}</td>
                    <td>
                      {showFinancialNumbers 
                        ? `${formatCurrency(pool.volume24h / 1000000, 'USD', true)}M`
                        : '•••'
                      }
                    </td>
                    <td>
                      {showFinancialNumbers 
                        ? formatCurrency(pool.fee24h, 'USD', true)
                        : '•••'
                      }
                    </td>
                    <td className={styles.explore__apr}>
                      {formatPercentage(pool.apr24h, 2, showFinancialNumbers)}
                    </td>
                    <td>{pool.rewards || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Lending Table */}
        {activeTab === 'Lending' && (
          <div className={styles.explore__tableWrapper}>
            <table className={styles.explore__table}>
              <thead>
                <tr>
                  <th>Protocol</th>
                  <th>Token</th>
                  <th>Supply APR</th>
                  <th>Borrow APR</th>
                  <th>Total Supply</th>
                  <th>Total Borrow</th>
                </tr>
              </thead>
              <tbody>
                {filteredLending.map((option) => (
                  <tr 
                    key={option.id}
                    className={styles.explore__tableRow}
                    onClick={() => navigate(`/lending/${option.id}`)}
                  >
                    <td>{option.protocol}</td>
                    <td>{option.token}</td>
                    <td className={styles.explore__apr}>
                      {formatPercentage(option.supplyApr, 2, showFinancialNumbers)}
                    </td>
                    <td className={styles.explore__apr}>
                      {formatPercentage(option.borrowApr, 2, showFinancialNumbers)}
                    </td>
                    <td>{formatCurrency(option.totalSupply, 'USD', showFinancialNumbers)}</td>
                    <td>{formatCurrency(option.totalBorrow, 'USD', showFinancialNumbers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Staking Strategies Table */}
        {activeTab === 'Staking' && (
          <div className={styles.explore__tableWrapper}>
            <table className={styles.explore__table}>
              <thead>
                <tr>
                  <th>Strategy Name</th>
                  <th>APY</th>
                  <th>Risk</th>
                  <th>TVL</th>
                </tr>
              </thead>
              <tbody>
                {filteredStrategies.map((strategy) => (
                  <tr 
                    key={strategy.id}
                    className={styles.explore__tableRow}
                    onClick={() => navigate(`/strategy/${strategy.id}`)}
                  >
                    <td>
                      <div className={styles.explore__strategyInfo}>
                        <div className={styles.explore__strategyIcon}>💎</div>
                        <div>
                          <div className={styles.explore__strategyName}>
                            {strategy.name}
                            {strategy.verified && <span className={styles.explore__verified}>✓</span>}
                          </div>
                          <div className={styles.explore__strategyProvider}>{strategy.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.explore__apr}>
                      <div>{formatPercentage(strategy.apy, 2, showFinancialNumbers)}</div>
                      {strategy.bonus && (
                        <div className={styles.explore__bonus}>
                          {strategy.bonus} <span className={styles.explore__bonusCheck}>✓</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.explore__risk}>
                        {getRiskBars(strategy.risk)}
                      </div>
                    </td>
                    <td>{formatCurrency(strategy.tvl, 'USD', showFinancialNumbers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

