import { magentoApi, parseProductResponse } from '../utils/index.js';
import { MgActions, RawMagentoProduct } from '@dg-live/ecommerce-data-types';
import {
  AppDataSource,
  MagentoProduct,
  Datasource,
} from '@dg-live/ecommerce-db';

const datasourceRepository = AppDataSource.getRepository(Datasource);

export const getAllProducts = async ({
  datasourceId,
}: {
  datasourceId: number;
}): Promise<any> => {
  try {
    const foundDatasource = await datasourceRepository.findOne({
      where: {
        id: datasourceId,
        platform: 'magento',
      },
      relations: {
        user: true,
      },
    });
    if (!foundDatasource) throw new Error('Datasource not found');
    const apiKey = foundDatasource.user.apiKey;

    const products: RawMagentoProduct = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.GET_PRODUCTS,
    });

    const productsAttributes = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.GET_PRODUCTS_ATTRIBUTES,
    });
    const categories = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.GET_CATEGORIES,
    });
    const categoriesList = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.GET_CATEGORIES_LIST,
    });
    console.log(productsAttributes);
    const syncedAt = new Date();
    await parseProductResponse(
      products as RawMagentoProduct,
      apiKey,
      datasourceId,
      syncedAt
    );
    return { products, productsAttributes, categories, categoriesList } as any;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const syncCatalog = async ({
  apiKey,
  datasourceId,
}: any): Promise<{
  savedProducts?: MagentoProduct[];
  updatedProducts?: MagentoProduct[];
}> => {
  try {
    const products = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.GET_PRODUCTS,
    });

    const syncedAt = new Date();
    if (products?.items?.length) {
      const savedProducts = await parseProductResponse(
        products as RawMagentoProduct,
        apiKey,
        datasourceId,
        syncedAt
      );
      let res: {
        savedProducts?: MagentoProduct[];
        updatedProducts?: MagentoProduct[];
      } = {
        savedProducts: savedProducts,
        updatedProducts: [],
      };
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
