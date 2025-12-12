import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSwapStore } from '@/store/swapStore';
import { useUIStore } from '@/store/uiStore';
import { api } from '@/utils/api';
import { formatNumber, formatPercentage } from '@/utils/format';
import { Card, Button, Modal } from '@/components';
import styles from './Swap.module.scss';

export const Swap: React.FC = () => {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    setFromToken,
    setToToken,
    setFromAmount,
    swapTokens,
  } = useSwapStore();
  const { tokenSelectorModalOpen, setTokenSelectorModalOpen, showFinancialNumbers } = useUIStore();
  const [selectingFor, setSelectingFor] = useState<'from' | 'to'>('from');

  const { data: tokens } = useQuery({
    queryKey: ['tokens'],
    queryFn: api.getTokens,
  });

  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ['swap-quote', fromToken?.id, toToken?.id, fromAmount],
    queryFn: () =>
      fromToken && toToken && fromAmount
        ? api.getSwapQuote(fromToken.id, toToken.id, fromAmount)
        : null,
    enabled: !!fromToken && !!toToken && !!fromAmount,
  });

  const handleTokenSelect = (token: any) => {
    if (selectingFor === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setTokenSelectorModalOpen(false);
  };

  return (
    <div className={styles.swap}>
      <Card>
        <div className={styles.swap__container}>
          <div className={styles.swap__header}>
            <h2>Swap Tokens</h2>
            <button
              className={styles.swap__history}
              onClick={() => {}}
            >
              History
            </button>
          </div>

          <div className={styles.swap__box}>
            <div className={styles.swap__input}>
              <div className={styles.swap__inputHeader}>
                <span>From</span>
                {fromToken && (
                  <span className={styles.swap__balance}>
                    Balance: {fromToken.balance}
                  </span>
                )}
              </div>
              <div className={styles.swap__inputContent}>
                <input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className={styles.swap__amount}
                />
                <button
                  className={styles.swap__tokenButton}
                  onClick={() => {
                    setSelectingFor('from');
                    setTokenSelectorModalOpen(true);
                  }}
                >
                  {fromToken ? fromToken.symbol : 'Select Token'}
                </button>
              </div>
            </div>

            <button
              className={styles.swap__swapButton}
              onClick={swapTokens}
              disabled={!fromToken || !toToken}
            >
              ⇅
            </button>

            <div className={styles.swap__input}>
              <div className={styles.swap__inputHeader}>
                <span>To</span>
              </div>
              <div className={styles.swap__inputContent}>
                <input
                  type="text"
                  placeholder="0.0"
                  value={quote?.toAmount || toAmount || ''}
                  readOnly
                  className={styles.swap__amount}
                />
                <button
                  className={styles.swap__tokenButton}
                  onClick={() => {
                    setSelectingFor('to');
                    setTokenSelectorModalOpen(true);
                  }}
                >
                  {toToken ? toToken.symbol : 'Select Token'}
                </button>
              </div>
            </div>

            {quote && (
              <div className={styles.swap__details}>
                <div className={styles.swap__detail}>
                  <span>Price Impact</span>
                  <span>{formatPercentage(quote.priceImpact, 2, showFinancialNumbers)}</span>
                </div>
                <div className={styles.swap__detail}>
                  <span>Slippage</span>
                  <span>{showFinancialNumbers ? `${slippage}%` : '•••'}</span>
                </div>
                <div className={styles.swap__detail}>
                  <span>Network Fee</span>
                  <span>{formatNumber(quote.networkFee, 2, showFinancialNumbers)} ETH</span>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!fromToken || !toToken || !fromAmount || quoteLoading}
              style={{ marginTop: '8px' }}
            >
              {quoteLoading ? 'Getting quote...' : 'Confirm Swap'}
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={tokenSelectorModalOpen}
        onClose={() => setTokenSelectorModalOpen(false)}
        title="Select Token"
      >
        <div className={styles.swap__tokenList}>
          {tokens?.map((token) => (
            <button
              key={token.id}
              className={styles.swap__tokenItem}
              onClick={() => handleTokenSelect(token)}
            >
              <div className={styles.swap__tokenInfo}>
                <div className={styles.swap__tokenSymbol}>{token.symbol}</div>
                <div className={styles.swap__tokenName}>{token.name}</div>
              </div>
              <div className={styles.swap__tokenBalance}>{token.balance}</div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

