import axios, { AxiosResponse } from 'axios';
import { envConfig } from '@dg-live/ecommerce-config';

const { subGraphEndpoint, subGraphVersion } = envConfig;
const http = axios.create({
  baseURL: `${subGraphEndpoint}/${subGraphVersion}`,
});

interface Payment {
  id: string;
  orderID: string;
  amount: string;
  beneficiary: string;
  buyer: string;
  transactionHash: string;
}
interface GraphPaymentData {
  payments: Payment[];
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
}): Promise<Payment[]> => {
  const query = `
    {
      payments(first: ${count}, skip: ${start}, orderBy: id, orderDirection: ${order}) {
        id
        orderID
        amount
        beneficiary
        buyer
        transactionHash
      }
    }`;
  try {
    const res = await http.post<AxiosResponse<GraphPaymentData>>('', {
      query,
    });
    return res.data.data.payments;
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
}): Promise<Payment[]> => {
  const transactions: Payment[] = await fetchTransactions({
    start,
    count,
    order,
  });
  if (transactions.length === count) {
    const nextTransactions = await fetchAllTransactions({
      start: start + count,
      count,
      order,
    });
    transactions.push(...nextTransactions);
  }
  return transactions;
};

export const fetchTransactionCount = async (): Promise<number> => {
  const query = `
  {
    transactionCounter(id: "1") {
      count
    }
  }`;
  const res = await http.post<
    AxiosResponse<{ transactionCounter: { count: number } }>
  >('', {
    query,
  });
  return +res.data.data.transactionCounter?.count || 0;
};
