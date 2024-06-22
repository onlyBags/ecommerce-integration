import { OnlyBagsOrderRequest } from '@dg-live/ecommerce-data-types';
import { AppDataSource, Datasource } from '@dg-live/ecommerce-db';

import { createOrder as createWcOrder } from '@dg-live/ecommerce-woocommerce';

import { createOrder as createMgOrder } from '@dg-live/ecommerce-magento';

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
  return await (foundDatasource.platform === 'woocommerce'
    ? createWcOrder(datasourceId, orderData)
    : createMgOrder(datasourceId, orderData));
};
