import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/format';
import { Card, Button, Modal } from '@/components';
import { useUIStore } from '@/store/uiStore';
import styles from './Staking.module.scss';

export const Staking: React.FC = () => {
  const { stakeModalOpen, setStakeModalOpen, showFinancialNumbers } = useUIStore();
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const { data: pools, isLoading } = useQuery({
    queryKey: ['staking-pools'],
    queryFn: api.getStakingPools,
  });

  const handleStake = () => {
    // Handle stake logic
    console.log('Staking', stakeAmount, 'in pool', selectedPool?.id);
    setStakeModalOpen(false);
    setStakeAmount('');
    setSelectedPool(null);
  };

  if (isLoading) {
    return <Card>Loading staking pools...</Card>;
  }

  return (
    <div className={styles.staking}>
      <Card>
        <div className={styles.staking__banner}>
          <h2>High-Yield Staking</h2>
          <p>Earn up to {pools?.[0]?.apr || 15}% APR on your tokens</p>
        </div>
      </Card>

      <Card title="Staking Pools">
        <div className={styles.staking__list}>
          {pools?.map((pool) => (
            <div key={pool.id} className={styles.staking__card}>
              <div className={styles.staking__header}>
                <div className={styles.staking__poolInfo}>
                  <div className={styles.staking__logo} />
                  <div>
                    <div className={styles.staking__name}>{pool.name}</div>
                    <div className={styles.staking__token}>{pool.token}</div>
                  </div>
                </div>
                <div className={styles.staking__apr}>
                  <div className={styles.staking__aprLabel}>APR</div>
                  <div className={styles.staking__aprValue}>
                    {formatPercentage(pool.apr, 2, showFinancialNumbers)}
                  </div>
                </div>
              </div>
              <div className={styles.staking__metrics}>
                <div className={styles.staking__metric}>
                  <span>Total Staked</span>
                  <span>{formatCurrency(pool.totalStaked, 'USD', showFinancialNumbers)}</span>
                </div>
                <div className={styles.staking__metric}>
                  <span>Your Staked</span>
                  <span>{formatNumber(pool.userStaked, 2, showFinancialNumbers)} {pool.token}</span>
                </div>
              </div>
              <div className={styles.staking__actions}>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedPool(pool);
                    setStakeModalOpen(true);
                  }}
                >
                  Stake
                </Button>
                {pool.userStaked > 0 && (
                  <Button variant="outline">Unstake</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={stakeModalOpen}
        onClose={() => {
          setStakeModalOpen(false);
          setSelectedPool(null);
          setStakeAmount('');
        }}
        title={`Stake ${selectedPool?.token || ''}`}
      >
        <div className={styles.staking__form}>
          <div className={styles.staking__field}>
            <label>Amount</label>
            <input
              type="number"
              placeholder="0.0"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className={styles.staking__input}
            />
          </div>
          {selectedPool && stakeAmount && (
            <div className={styles.staking__earnings}>
              <div className={styles.staking__earningsLabel}>
                Expected Annual Earnings
              </div>
              <div className={styles.staking__earningsValue}>
                {formatCurrency(
                  (parseFloat(stakeAmount) * selectedPool.apr) / 100,
                  'USD',
                  showFinancialNumbers
                )}
              </div>
            </div>
          )}
          <Button variant="primary" fullWidth onClick={handleStake}>
            Confirm Stake
          </Button>
        </div>
      </Modal>
    </div>
  );
};

