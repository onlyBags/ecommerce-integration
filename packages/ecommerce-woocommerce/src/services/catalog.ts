import { AppDataSource, User, Datasource } from '@dg-live/ecommerce-db';

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { WoocomerceProduct } from 'src/index.js';

const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);

const WooCommerceRest = WooCommerceRestApi.default;

const createNewWoocommerceInstance = ({
  url,
  consumerKey,
  consumerSecret,
}): any => {
  const WooCommerceApi = new WooCommerceRest({
    url,
    consumerKey,
    consumerSecret,
    version: 'wc/v3',
  });
  return WooCommerceApi;
};

export const getAllProducts = async ({
  apiKey,
  datasourceId,
}: any): Promise<WoocomerceProduct[]> => {
  try {
    const foundUserDatasource = await userRepository.findOne({
      relations: ['datasource'],
      where: {
        apiKey,
        datasource: {
          id: datasourceId,
        },
      },
    });
    if (!foundUserDatasource) return null;
    const { baseUrl, consumerKey, consumerSecret } =
      foundUserDatasource.datasource[0];
    const wc = createNewWoocommerceInstance({
      url: baseUrl,
      consumerKey,
      consumerSecret,
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
