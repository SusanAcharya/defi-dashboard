import { AddressBookEntry } from '@/types';
import { apiClient } from './client';

export async function getAddressBook(): Promise<AddressBookEntry[]> {
  return apiClient.get<AddressBookEntry[]>('/address-book');
}
