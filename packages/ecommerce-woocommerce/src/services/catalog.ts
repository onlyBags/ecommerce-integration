import { createNewWoocommerceInstance } from '../util/index.js';
import { WoocomerceProductRes } from '../interfaces/index.js';

export const getAllProducts = async ({
  apiKey,
  datasourceId,
}: any): Promise<WoocomerceProductRes[]> => {
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
    if (products?.data?.length) return products.data as WoocomerceProductRes[];
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
    if (products?.data?.length) return products.data as WoocomerceProductRes[];
    return [];
  } catch (err) {
    throw err;
  }
};
