import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatCurrency, formatTimestamp } from '@/utils/format';
import { Card, Button } from '@/components';
import styles from './NFTs.module.scss';

export const NFTs: React.FC = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: api.getNFTs,
  });

  if (isLoading) {
    return <Card>Loading NFTs...</Card>;
  }

  return (
    <div className={styles.nfts}>
      <Card>
        <div className={styles.nfts__header}>
          <h2>NFT Discovery</h2>
          <div className={styles.nfts__alerts}>
            <span>Mint Alerts</span>
            <button
              className={`${styles.nfts__toggle} ${
                alertsEnabled ? styles.nfts__toggle_active : ''
              }`}
              onClick={() => setAlertsEnabled(!alertsEnabled)}
            >
              {alertsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </Card>

      <Card title="NFT Mint Feed">
        <div className={styles.nfts__list}>
          {nfts?.map((nft) => (
            <div key={nft.id} className={styles.nfts__card}>
              <div className={styles.nfts__image}>
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} />
                ) : (
                  <div className={styles.nfts__placeholder}>🖼️</div>
                )}
              </div>
              <div className={styles.nfts__info}>
                <div className={styles.nfts__collection}>{nft.collection}</div>
                <div className={styles.nfts__name}>{nft.name}</div>
                <div className={styles.nfts__metrics}>
                  <div className={styles.nfts__metric}>
                    <span>Floor Price</span>
                    <span>{formatCurrency(nft.floorPrice)}</span>
                  </div>
                  {nft.mintPrice && (
                    <div className={styles.nfts__metric}>
                      <span>Mint Price</span>
                      <span>{formatCurrency(nft.mintPrice)}</span>
                    </div>
                  )}
                  {nft.supply && (
                    <div className={styles.nfts__metric}>
                      <span>Supply</span>
                      <span>{nft.supply.toLocaleString()}</span>
                    </div>
                  )}
                  {nft.launchDate && (
                    <div className={styles.nfts__metric}>
                      <span>Launch</span>
                      <span>{formatTimestamp(nft.launchDate)}</span>
                    </div>
                  )}
                </div>
                <div className={styles.nfts__actions}>
                  <Button variant="primary" size="sm">View Details</Button>
                  {nft.launchDate && (
                    <Button variant="outline" size="sm">Set Alert</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Floor Price Tracker">
        <div className={styles.nfts__tracker}>
          <p>Track floor price changes for your favorite collections</p>
          <div className={styles.nfts__trackerList}>
            {nfts?.map((nft) => (
              <div key={nft.id} className={styles.nfts__trackerItem}>
                <div className={styles.nfts__trackerInfo}>
                  <div className={styles.nfts__trackerCollection}>
                    {nft.collection}
                  </div>
                  <div className={styles.nfts__trackerPrice}>
                    {formatCurrency(nft.floorPrice)}
                  </div>
                </div>
                <div className={styles.nfts__trackerChange}>+2.5%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

