import {
  createNewWoocommerceInstance,
  parseProductResponse,
} from '../util/index.js';

import {
  WCRequestOptions,
  WCUpdateProduct,
  WoocommerceProductRes,
} from '../interfaces/index.js';

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
}: WCRequestOptions): Promise<{
  savedProducts?: WoocommerceProduct[];
  updatedProducts?: WoocommerceProduct[];
}> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    // const products: any = {
    //   data: JSON.parse(myData),
    // };
    const products = await wc.get('products', {
      on_sale: true,
      status: 'publish',
      per_page: 100,
      stock_status: 'instock',
    });
    const syncedAt = new Date();
    if (products?.data?.length) {
      const woocommerceProducts = await parseProductResponse(
        products.data as WoocommerceProductRes[],
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
    throw err;
  }
};

export const updateProduct = async ({
  apiKey,
  datasourceId,
  product,
}: WCUpdateProduct): Promise<{
  savedProducts?: WoocommerceProduct[];
  updatedProducts?: WoocommerceProduct[];
}> => {
  try {
    const foundUser = await userRepository.findOne({
      where: { apiKey, datasource: { id: datasourceId } },
      relations: ['datasource'],
    });
    const foundProduct = await woocommerceProductRepository.findOne({
      where: {
        productId: product.id,
      },
      relations: {
        categories: true,
        tags: true,
        images: true,
        attributes: true,
        dimensions: true,
        metaData: true,
      },
    });

    if (foundProduct) {
      const woocommerceProduct = await parseProductResponse(
        [product],
        datasourceId,
        new Date()
      );
      if (woocommerceProduct.length > 1)
        throw new Error(
          "Can't update product, more than one product found for id: " +
            product.id
        );
      const updateRes = await upsertProduct(woocommerceProduct[0]);
      if (updateRes.updatedProduct) {
        return {
          updatedProducts: [updateRes.updatedProduct],
        };
      }
      throw new Error("Can't update product, for id: " + product.id);
    }
    throw new Error(
      "Can't update product, no products found for id: " + product.id
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const upsertProduct = async (woocommerceProduct: WoocommerceProduct) => {
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
