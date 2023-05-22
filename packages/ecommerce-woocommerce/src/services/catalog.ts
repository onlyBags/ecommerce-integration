import { AppDataSource, User } from '@dg-live/ecommerce-db';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

import { createNewWoocommerceInstance } from '../util/index.js';
import { WoocomerceProduct } from 'src/index.js';

const userRepository = AppDataSource.getRepository(User);

const WooCommerceRest = WooCommerceRestApi.default;

export const getAllProducts = async ({
  apiKey,
  datasourceId,
}: any): Promise<WoocomerceProduct[]> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const products = await wc.get('products', {
      on_sale: true,
      status: 'publish',
      per_page: 100,
      stock_status: 'instock',
    });
    if (products?.data?.length) return products.data as WoocomerceProduct[];
    return [];
  } catch (err) {
    throw err;
  }
};

export const syncCatalog = async ({ apiKey, datasourceId }: any) => {
  console.log('getAllProducts');
  const foundUserDatasource = await userRepository.findOne({
    relations: ['datasource'],
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
      },
    },
  });
  if (!foundUserDatasource) throw new Error('User not found');
  console.log('foundUserDatasource: ', foundUserDatasource);
};
