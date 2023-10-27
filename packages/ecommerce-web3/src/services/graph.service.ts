import axios, { AxiosResponse } from 'axios';
import { envConfig } from '@dg-live/ecommerce-config';

const { subGraphEndpoint, subGraphVersion } = envConfig;
const http = axios.create({
  baseURL: `${subGraphEndpoint}/${subGraphVersion}`,
});

interface GraphTransactionData {
  blockId: string;
  buyerId: string;
  hash: string;
  nftAddress: string;
  price: string;
  recipientId: string;
  sellerId: string;
  timestamp: string;
  tokenId: string;
  transactionId: string;
  type: string;
}

interface GraphTransactionsCount {
  count: string;
}

const fetchTransactions = async ({
  start,
  count,
  order,
  orderBy = 'timestamp',
}: {
  start: number;
  count: number;
  order: string;
  orderBy?: string;
}): Promise<any> => {
  const query = `
    {
      transactions(first: ${count}, skip: ${start}, orderBy: ${orderBy}, orderDirection: ${order}) {
        id
        hash
        timestamp
        type
        blockNumber
        buyer {
          id
        }
        recipient {
          id
        }
        seller {
          id
        }
        price
        nft {
          id
          nftAddress {
            id
          }
          tokenId
          tokenURI
        }
      }
    }`;
  try {
    const res = await http.post<
      AxiosResponse<{ transactions: GraphTransactionData[] }>
    >('', {
      query,
    });
    return res.data.data.transactions.map((transaction: any) => {
      return {
        transactionId: transaction.id,
        hash: transaction.hash,
        timestamp: transaction.timestamp,
        type: transaction.type,
        blockId: transaction.blockNumber,
        sellerId: transaction.seller.id,
        price: transaction.price,
        nftAddress: transaction.nft.id.split('-')[0],
        tokenId: transaction.nft.tokenId,
        tokenURI: transaction.nft.tokenURI,
        buyerId: transaction.buyer ? transaction.buyer.id : 'None',
        recipientId: transaction.recipient ? transaction.recipient.id : 'None',
      };
    }) as any;
  } catch (err) {
    console.log(err);
    debugger;
    throw new Error(err);
  }
};

export const fetchAllTransactions = async ({
  start = 0,
  count = 1000,
  order = 'asc',
}: {
  start: number;
  count?: number;
  order?: string;
}) => {
  debugger;
  const transactions: any = await fetchTransactions({ start, count, order });
  // If the number of transactions is equal to the limit
  // then there might be more transactions
  if (transactions.length === count) {
    // Fetch more transactions
    const nextTransactions = await fetchAllTransactions({
      start: start + count,
      count,
      order,
    });

    // Append the transactions fetched in the next request
    transactions.push(...nextTransactions);
  }
  debugger;
  return transactions;
};

export const fetchTransactionCount = async (): Promise<number> => {
  const query = `
  {
    transactionCounter(id:"global") {
      count
    }
  }`;
  const res = await http.post<
    AxiosResponse<{ transactionCounter: { count: number } }>
  >('', {
    query,
  });
  return +res.data.data.transactionCounter.count;
};
