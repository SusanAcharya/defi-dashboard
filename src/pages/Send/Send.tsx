import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '@/store/uiStore';
import { api } from '@/utils/api';
import { formatNumber } from '@/utils/format';
import { Card, Button, Modal } from '@/components';
import styles from './Send.module.scss';

export const Send: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { tokenSelectorModalOpen, setTokenSelectorModalOpen, setAddressBookModalOpen, showFinancialNumbers } = useUIStore();

  const { data: tokens } = useQuery({
    queryKey: ['tokens'],
    queryFn: api.getTokens,
  });

  const handleSend = () => {
    // Handle send logic
    console.log('Sending', amount, selectedToken?.symbol, 'to', recipient);
  };

  return (
    <div className={styles.send}>
      <Card>
        <h2>Send Tokens</h2>
        <div className={styles.send__form}>
          <div className={styles.send__field}>
            <label>Token</label>
            <button
              className={styles.send__tokenButton}
              onClick={() => setTokenSelectorModalOpen(true)}
            >
              {selectedToken ? selectedToken.symbol : 'Select Token'}
            </button>
          </div>

          <div className={styles.send__field}>
            <label>Amount</label>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.send__input}
            />
            {selectedToken && (
              <div className={styles.send__balance}>
                Balance: {selectedToken.balance} {selectedToken.symbol}
              </div>
            )}
          </div>

          <div className={styles.send__field}>
            <label>Recipient Address</label>
            <div className={styles.send__recipient}>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={styles.send__input}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddressBookModalOpen(true)}
              >
                Address Book
              </Button>
            </div>
          </div>

          <div className={styles.send__fee}>
            <span>Network Fee</span>
            <span>{formatNumber(0.001, 2, showFinancialNumbers)} ETH</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedToken || !amount || !recipient}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={tokenSelectorModalOpen}
        onClose={() => setTokenSelectorModalOpen(false)}
        title="Select Token"
      >
        <div className={styles.send__tokenList}>
          {tokens?.map((token) => (
            <button
              key={token.id}
              className={styles.send__tokenItem}
              onClick={() => {
                setSelectedToken(token);
                setTokenSelectorModalOpen(false);
              }}
            >
              <div className={styles.send__tokenInfo}>
                <div className={styles.send__tokenSymbol}>{token.symbol}</div>
                <div className={styles.send__tokenName}>{token.name}</div>
              </div>
              <div className={styles.send__tokenBalance}>{token.balance}</div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

