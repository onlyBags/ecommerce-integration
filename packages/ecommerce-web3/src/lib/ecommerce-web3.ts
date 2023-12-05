import {
  AppDataSource,
  Customer,
  Datasource,
  Order,
  OrderLog,
  User,
} from '@dg-live/ecommerce-db';
import { EcommerceWsData, notifyPurschase } from '@dg-live/ecommerce-websocket';
import {
  fetchTransactionCount,
  fetchAllTransactions,
} from '../services/graph.service.js';

import {
  getCustomer,
  getOrderById,
  saveOrder,
  setOrderAsPayed,
} from '@dg-live/ecommerce-woocommerce';
import { Payment, WCValidateOrderData } from '@dg-live/ecommerce-data-types';
import { Not } from 'typeorm';

const orderRepository = AppDataSource.getRepository(Order);
const orderLogRepository = AppDataSource.getRepository(OrderLog);
const customerRepository = AppDataSource.getRepository(Customer);
const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);

export const buildOrders = async (start: number): Promise<void> => {
  try {
    const allPayments = await fetchAllTransactions({
      start: start || 0,
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
      let order = await orderRepository.findOne({
        relations: {
          orderLog: true,
        },
        where: {
          storeOrderId: +payment.orderID,
        },
      });
      // const datasourceData = await datasourceRepository.find({
      //   relations: {
      //     orders: {
      //       orderLog: true,
      //     },
      //   },
      //   where: {
      //     id: payment.dataSource,
      //     orders: {
      //       storeOrderId: +payment.orderID,
      //     },
      //   },
      // });
      if (!customer || !user) continue;
      if (!order) order = await rebuildOrder(payment);
      if (user.wallet.toLowerCase() !== payment.beneficiary.toLowerCase())
        continue;
      let orderLog = order.orderLog;
      if (!orderLog) {
        const orderLogToSave = new OrderLog();
        orderLogToSave.transactionHash = payment.transactionHash;
        orderLogToSave.amount = payment.amount;
        orderLogToSave.customer = customer;
        orderLogToSave.user = user;
        orderLogToSave.orderStatus = 'pending';
        orderLogToSave.isValidated = false;
        await orderLogRepository.save(orderLogToSave);
        order.orderLog = orderLogToSave;
        await orderRepository.save(order);
      }
    }
  } catch (err) {
    throw new Error('buildOrders::error: ' + err.message);
  }
};

const rebuildOrder = async (payment: Payment) => {
  const data: WCValidateOrderData = {
    orderId: +payment.orderID,
    datasourceId: payment.dataSource,
  };
  try {
    const order = await getOrderById(data);
    const customer = await getCustomer(payment.buyer);
    const savedOrder = await saveOrder(order, customer, payment.dataSource);
    return savedOrder;
  } catch (error) {
    console.log('error', error);
  }
};

const validateOrdersVsWoocommerce = async () => {
  const orders = await orderRepository.find({
    relations: {
      orderLog: true,
    },
    where: {
      status: Not('completed'),
    },
  });
  if (orders.length) {
    for (const order of orders) {
      const orderToValidate = await orderRepository.findOne({
        relations: {
          orderLog: {
            user: {
              datasource: true,
            },
          },
        },
        where: {
          id: order.id,
        },
      });
      if (!orderToValidate) continue;
      const orderLog = orderToValidate.orderLog;
      const orderStatus = await setOrderAsPayed(orderToValidate);
      if (orderStatus) {
        orderLog.isValidated = true;
        orderLog.orderStatus = 'completed';
        orderToValidate.status = 'completed';
        await orderRepository.save(orderToValidate);
        await orderLogRepository.save(orderLog);
        const notifyData: EcommerceWsData = {
          type: 'ecommerce',
          datasource: orderLog.user.datasource[0].id,
          wallet: orderLog.user.wallet,
          status: 'success',
          orderId: order.storeOrderId,
        };
        notifyPurschase(notifyData);
      }
    }
  }
};

export const startGraphPolling = () => {
  let isPolling = false;
  setInterval(async () => {
    if (!isPolling) {
      isPolling = !isPolling;
      const localOrdersCount = await orderLogRepository.count({
        where: {
          isValidated: true,
        },
      });
      const graphOrdersCount = await fetchTransactionCount();
      if (localOrdersCount < graphOrdersCount) {
        await buildOrders(localOrdersCount);
        await validateOrdersVsWoocommerce();
      }
      isPolling = !isPolling;
    }
  }, 1500);
};
