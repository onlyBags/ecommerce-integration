import { AppDataSource, OrderLog } from '@dg-live/ecommerce-db';
import {
  fetchTransactionCount,
  fetchAllTransactions,
} from '../services/graph.service.js';

const orderLogRepository = AppDataSource.getRepository(OrderLog);

export const rebuildLostOrders = async (isPolling = false): Promise<void> => {
  try {
    await orderLogRepository.delete({
      isValidated: false,
    });
    const localTransactionsCount = await orderLogRepository.count();
    const allTx = await fetchAllTransactions({
      start: localTransactionsCount || 0,
    });
    await fetchTransactionCount();
    let currentTx = 0;
    const totalTx = allTx.length;
    debugger;
    return null;
    for (const tx of allTx) {
      currentTx++;
      const {
        blockId,
        buyerId,
        hash,
        nftAddress,
        price,
        recipientId,
        sellerId,
        timestamp,
        tokenId,
        transactionId,
        type,
        tokenURI,
      } = tx;
      const lowerType = type.toLowerCase();
      const transactionData: any = {
        transactionHash: hash,
        blockNumber: +blockId,
        type: lowerType,
        timestamp: new Date(+timestamp * 1000),
        tokenId: tokenId,
        price: price,
        from: sellerId,
        to:
          buyerId !== '0x0000000000000000000000000000000000000000'
            ? buyerId
            : '',
        recipient:
          recipientId !== '0x0000000000000000000000000000000000000000'
            ? recipientId
            : '',
      };
    }
  } catch (err) {
    throw console.error('rebuildLostTransactions::error: ', err);
  }
};
export const startGraphPolling = () => {
  let isPolling = false;
  setInterval(async () => {
    if (!isPolling) {
      isPolling = !isPolling;
      const localOrdersCount = await orderLogRepository.count();
      const graphOrdersCount = await fetchTransactionCount();
      if (localOrdersCount < graphOrdersCount) await rebuildLostOrders(true);
      isPolling = !isPolling;
    }
  }, 15000);
};
