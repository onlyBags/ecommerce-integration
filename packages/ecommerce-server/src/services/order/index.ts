import {
  OnlyBagsOrderRequest,
  WCOrderCreated,
} from '@dg-live/ecommerce-data-types';
import { AppDataSource, Datasource } from '@dg-live/ecommerce-db';

import { createOrder as createWcOrder } from '@dg-live/ecommerce-woocommerce';

import { createOrder as createMgOrder } from '@dg-live/ecommerce-magento';
import { createPaymentLink } from '@dg-live/ecommerce-payment-service';

const dataSourceRepository = AppDataSource.getRepository(Datasource);
export const createOrder = async (
  datasourceId: number,
  orderData: OnlyBagsOrderRequest
) => {
  const foundDatasource = await dataSourceRepository.findOne({
    where: {
      id: datasourceId,
    },
  });
  if (!foundDatasource) {
    throw new Error('Datasource not found');
  }
  const platform = foundDatasource.platform;
  const createdOrder = await (platform === 'woocommerce'
    ? createWcOrder(datasourceId, orderData)
    : createMgOrder(datasourceId, orderData));
  if (orderData.paymentMethod.toUpperCase() === 'BINANCE') {
    const items = orderData.lineItems.map((item) => ({
      id: item.productId.toString(),
      name: item.name,
      description: item.description || 'No Description Provided',
    }));
    return createPaymentLink({
      orderId: createdOrder.dgLiveOrder.id,
      storeOrderId:
        platform === 'woocommerce'
          ? createdOrder.dgLiveOrder.storeOrderId
          : createdOrder.dgLiveOrder.orderKey,
      datasourceId,
      customerWallet: orderData.wallet,
      totalPrice: createdOrder.dgLiveOrder.total,
      email: orderData.email,
      products: items,
    });
  }
  return createdOrder;
};
