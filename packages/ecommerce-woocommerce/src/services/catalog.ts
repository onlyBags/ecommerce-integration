import {
  createNewWoocommerceInstance,
  parseProductResponse,
} from '../util/index.js';

import {
  WCRequestOptions,
  WCUpdateProduct,
  WoocommerceProductRes,
} from '@dg-live/ecommerce-data-types';

import { AppDataSource, WoocommerceProduct, User } from '@dg-live/ecommerce-db';
// import { myData } from './mydata.js';

const userRepository = AppDataSource.getRepository(User);
const woocommerceProductRepository =
  AppDataSource.getRepository(WoocommerceProduct);
export const getAllProducts = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions): Promise<WoocommerceProduct[]> => {
  try {
    const foundUser = await userRepository.findOne({
      where: { apiKey, datasource: { id: datasourceId } },
      relations: {
        datasource: {
          woocommerceProduct: {
            images: true,
            slot: true,
            categories: true,
            attributes: {
              options: true,
            },
          },
        },
      },
    });
    console.log(foundUser);
    if (
      !foundUser ||
      !foundUser.datasource.length ||
      !foundUser.datasource[0].woocommerceProduct.length
    )
      return [];
    return foundUser.datasource[0].woocommerceProduct;
  } catch (err) {
    throw err;
  }
};

export const syncCatalog = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions): Promise<{
  savedProducts?: WoocommerceProduct[];
  updatedProducts?: WoocommerceProduct[];
}> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const products = await wc.get('products', {
      // on_sale: true,
      status: 'publish',
      per_page: 100,
      stock_status: 'instock',
    });

    const syncedAt = new Date();
    if (products?.data?.length) {
      const woocommerceProducts = await parseProductResponse(
        products.data as WoocommerceProductRes[],
        apiKey,
        datasourceId,
        syncedAt
      );
      let res: {
        savedProducts?: WoocommerceProduct[];
        updatedProducts?: WoocommerceProduct[];
      } = {
        savedProducts: [],
        updatedProducts: [],
      };
      for (let woocommerceProduct of woocommerceProducts) {
        const { savedProduct, updatedProduct } = await upsertProduct(
          woocommerceProduct
        );
        if (savedProduct) {
          res.savedProducts.push(savedProduct);
        } else if (updatedProduct) {
          res.updatedProducts.push(updatedProduct);
        }
      }
      return res;
    }
    return {
      savedProducts: [],
      updatedProducts: [],
    };
  } catch (err) {
    console.log(err);
    debugger;
    throw err;
  }
};

export const updateProduct = async ({
  apiKey,
  datasourceId,
  product,
}: WCUpdateProduct): Promise<{
  updatedProducts: WoocommerceProduct[];
}> => {
  try {
    const foundUser = await userRepository.findOne({
      where: {
        apiKey,
        datasource: {
          id: datasourceId,
          woocommerceProduct: {
            productId: product.id,
          },
        },
      },
      relations: {
        datasource: {
          woocommerceProduct: {
            categories: true,
            tags: true,
            images: true,
            attributes: {
              options: true,
            },
            dimensions: true,
            metaData: false,
          },
        },
      },
    });
    if (!foundUser || !foundUser.datasource.length)
      return { updatedProducts: [] };
    const foundProduct = await woocommerceProductRepository.findOne({
      where: {
        productId: product.id,
      },
    });
    if (foundProduct) {
      const woocommerceProduct = await parseProductResponse(
        [product],
        apiKey,
        datasourceId,
        new Date()
      );
      if (woocommerceProduct.length > 0) {
        return {
          updatedProducts: woocommerceProduct,
        };
      } else {
        throw new Error('No product updated for id: ' + product.id);
      }
    }
    throw new Error('No product found for id: ' + product.id);
  } catch (err) {
    console.log(err);
    debugger;
    throw err;
  }
};

export const createProduct = async ({
  apiKey,
  datasourceId,
  product,
}: WCUpdateProduct): Promise<{
  savedProduct: WoocommerceProduct;
}> => {
  try {
    const woocommerceProduct = await parseProductResponse(
      [product],
      apiKey,
      datasourceId,
      new Date()
    );
    if (woocommerceProduct.length > 0) {
      const { savedProduct } = await upsertProduct(woocommerceProduct[0]);
      return {
        savedProduct,
      };
    } else {
      throw new Error('No product updated for id: ' + product.id);
    }
  } catch (err) {
    console.log(err);
    debugger;
    throw err;
  }
};

export const upsertProduct = async (woocommerceProduct: WoocommerceProduct) => {
  let savedProduct: WoocommerceProduct;
  let updatedProduct: WoocommerceProduct;
  try {
    const foundProduct = await woocommerceProductRepository.findOne({
      where: {
        productId: woocommerceProduct.productId,
        datasourceId: woocommerceProduct.datasourceId,
      },
    });
    if (foundProduct) {
      updatedProduct = await woocommerceProductRepository.save({
        ...foundProduct,
        ...woocommerceProduct,
      });
    } else {
      savedProduct = await woocommerceProductRepository.save(
        woocommerceProduct
      );
    }
    return {
      savedProduct,
      updatedProduct,
    };
  } catch (err) {
    throw err;
  }
};
