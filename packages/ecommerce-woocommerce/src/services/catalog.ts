import { createNewWoocommerceInstance } from '../util/index.js';
import { WoocomerceProduct } from '../interfaces/index.js';

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
