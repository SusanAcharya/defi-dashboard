import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatTimestamp } from '@/utils/format';
import { useUIStore } from '@/store/uiStore';
import { Card, Button } from '@/components';
import styles from './Airdrops.module.scss';

export const Airdrops: React.FC = () => {
  const showFinancialNumbers = useUIStore((state) => state.showFinancialNumbers);
  const { data: airdrops, isLoading } = useQuery({
    queryKey: ['airdrops'],
    queryFn: api.getAirdrops,
  });

  const eligible = airdrops?.filter((a) => a.eligible && a.claimable) || [];
  const upcoming = airdrops?.filter((a) => !a.eligible || !a.claimable) || [];

  if (isLoading) {
    return <Card>Loading airdrops...</Card>;
  }

  return (
    <div className={styles.airdrops}>
      {eligible.length > 0 && (
        <Card>
          <h2>Eligible Airdrops</h2>
          <div className={styles.airdrops__total}>
            Total Unclaimed Value:{' '}
            {formatCurrency(
              eligible.reduce((sum, a) => sum + a.unclaimedValue, 0),
              'USD',
              showFinancialNumbers
            )}
          </div>
          <div className={styles.airdrops__list}>
            {eligible.map((airdrop) => (
              <div key={airdrop.id} className={styles.airdrops__card}>
                <div className={styles.airdrops__info}>
                  <div className={styles.airdrops__name}>{airdrop.name}</div>
                  <div className={styles.airdrops__description}>
                    {airdrop.description}
                  </div>
                  <div className={styles.airdrops__value}>
                    {formatCurrency(airdrop.unclaimedValue, 'USD', showFinancialNumbers)}
                  </div>
                </div>
                <Button variant="primary">Claim Now</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2>Upcoming Airdrops</h2>
        <div className={styles.airdrops__list}>
          {upcoming.map((airdrop) => (
            <div key={airdrop.id} className={styles.airdrops__card}>
              <div className={styles.airdrops__info}>
                <div className={styles.airdrops__name}>{airdrop.name}</div>
                <div className={styles.airdrops__description}>
                  {airdrop.description}
                </div>
                {airdrop.launchDate && (
                  <div className={styles.airdrops__launch}>
                    Launch: {formatTimestamp(airdrop.launchDate)}
                  </div>
                )}
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2>Airdrop Farming Opportunities</h2>
        <div className={styles.airdrops__farming}>
          <p>Complete these activities to become eligible for upcoming airdrops:</p>
          <ul className={styles.airdrops__checklist}>
            <li>✅ Swap tokens on DEX</li>
            <li>✅ Provide liquidity to pools</li>
            <li>✅ Stake tokens</li>
            <li>⏳ Bridge assets to StarkNet</li>
            <li>⏳ Interact with 5+ protocols</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

