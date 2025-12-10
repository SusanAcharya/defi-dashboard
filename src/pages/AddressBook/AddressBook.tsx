import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { formatAddress } from '@/utils/format';
import { Card, Button, Modal } from '@/components';
import styles from './AddressBook.module.scss';

export const AddressBook: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['address-book'],
    queryFn: api.getAddressBook,
  });

  const handleAdd = () => {
    // Handle add logic
    console.log('Adding address', newName, newAddress, newNotes);
    setIsAdding(false);
    setNewName('');
    setNewAddress('');
    setNewNotes('');
  };

  return (
    <div className={styles.addressBook}>
      <Card>
        <div className={styles.addressBook__header}>
          <h2>Address Book</h2>
          <Button onClick={() => setIsAdding(true)}>Add Contact</Button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className={styles.addressBook__list}>
            {addresses?.map((address) => (
              <div key={address.id} className={styles.addressBook__item}>
                <div className={styles.addressBook__info}>
                  <div className={styles.addressBook__name}>{address.name}</div>
                  <div className={styles.addressBook__address}>
                    {formatAddress(address.address)}
                  </div>
                  {address.notes && (
                    <div className={styles.addressBook__notes}>{address.notes}</div>
                  )}
                </div>
                <div className={styles.addressBook__actions}>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="Add Contact"
      >
        <div className={styles.addressBook__form}>
          <div className={styles.addressBook__field}>
            <label>Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Contact name"
              className={styles.addressBook__input}
            />
          </div>
          <div className={styles.addressBook__field}>
            <label>Address</label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="0x..."
              className={styles.addressBook__input}
            />
          </div>
          <div className={styles.addressBook__field}>
            <label>Notes (optional)</label>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Additional notes"
              className={styles.addressBook__textarea}
            />
          </div>
          <Button variant="primary" fullWidth onClick={handleAdd}>
            Add Contact
          </Button>
        </div>
      </Modal>
    </div>
  );
};

