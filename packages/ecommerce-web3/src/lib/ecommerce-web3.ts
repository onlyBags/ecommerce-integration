import {
  AppDataSource,
  Customer,
  Order,
  OrderLog,
  User,
} from '@dg-live/ecommerce-db';
import {
  fetchTransactionCount,
  fetchAllTransactions,
} from '../services/graph.service.js';

const orderRepository = AppDataSource.getRepository(Order);
const orderLogRepository = AppDataSource.getRepository(OrderLog);
const customerRepository = AppDataSource.getRepository(Customer);
const userRepository = AppDataSource.getRepository(User);

export const buildOrders = async (isPolling = false): Promise<void> => {
  try {
    await orderLogRepository.delete({
      isValidated: false,
    });
    const localTransactionsCount = await orderLogRepository.count();
    const allPayments = await fetchAllTransactions({
      start: localTransactionsCount || 0,
    });
    for (const payment of allPayments) {
      const customer = await customerRepository.findOne({
        where: {
          wallet: payment.buyer,
        },
      });

      const user = await userRepository.findOne({
        where: {
          wallet: payment.beneficiary,
        },
      });

      const order = await orderRepository.findOneBy({
        id: +payment.orderID,
      });
      if (!order || !customer || !user) continue;
      if (user.wallet.toLowerCase() !== payment.beneficiary.toLowerCase())
        continue;
      const orderLog = new OrderLog();
      orderLog.transactionHash = payment.transactionHash;
      orderLog.amount = payment.amount;
      orderLog.customer = customer;
      orderLog.user = user;
      orderLog.orderStatus = 'pending';
      orderLog.isValidated = false;
      order.orderLog = orderLog;
      await orderLogRepository.save(orderLog);
    }
  } catch (err) {
    throw new Error('buildOrders::error: ' + err.message);
  }
};

const validateOrdersVsWoocommerce = () => {};

export const startGraphPolling = () => {
  let isPolling = false;
  setInterval(async () => {
    if (!isPolling) {
      isPolling = !isPolling;
      const localOrdersCount = await orderLogRepository.count();
      const graphOrdersCount = await fetchTransactionCount();
      if (localOrdersCount < graphOrdersCount) await buildOrders(true);
      isPolling = !isPolling;
    }
  }, 15000);
};
