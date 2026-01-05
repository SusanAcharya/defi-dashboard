export interface Transaction {
  blockNumber: number;
  transactionHash: string;
  eventIndex: number;
  timestamp: string;
  from: string;
  to: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  decimals: number;
  type: 'sent' | 'received';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    data: Transaction[];
    pagination: PaginationInfo;
  };
}
