import {
  createNewWoocommerceInstance,
  parseProductResponse,
} from '../util/index.js';
import { WoocommerceProductRes } from '../interfaces/index.js';

import { AppDataSource, WoocommerceProduct } from '@dg-live/ecommerce-db';

const woocommerceProductRepository =
  AppDataSource.getRepository(WoocommerceProduct);
export const getAllProducts = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}): Promise<WoocommerceProduct[]> => {
  try {
    const products = await woocommerceProductRepository.find({
      where: {
        datasourceId,
      },
    });
    if (products && products.length) return products;
    return [];
  } catch (err) {
    throw err;
  }
};

export const syncCatalog = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}): Promise<WoocommerceProduct[]> => {
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
    if (products?.data?.length) {
      const woocommerceProducts = parseProductResponse(
        products.data as WoocommerceProductRes[],
        datasourceId
      );
      let res: WoocommerceProduct[] = [];
      for (let woocommerceProduct of woocommerceProducts) {
        const saved = await woocommerceProductRepository.save(
          woocommerceProduct
        );
        if (saved) res.push(saved);
      }
      return res;
    }
    return [];
  } catch (err) {
    throw err;
  }
};
