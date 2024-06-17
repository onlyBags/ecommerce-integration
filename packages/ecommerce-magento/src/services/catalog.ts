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
}): Promise<MagentoProduct[]> => {
  try {
    const foundDatasource = await datasourceRepository.findOne({
      where: {
        id: datasourceId,
      },
      relations: {
        magentoProduct: {
          mediaGalleryEntries: true,
          customAttributes: true,
          productLinks: true,
          extensionAttributes: true,
        },
      },
    });
    if (!foundDatasource || !foundDatasource.magentoProduct.length) return [];
    return addImageBaseUrl(foundDatasource);
  } catch (err) {
    throw err;
  }
};

const addImageBaseUrl = (datasource: Datasource) => {
  const baseUrl = datasource.baseUrl;
  datasource.magentoProduct.forEach((product) => {
    product.mediaGalleryEntries.forEach((media) => {
      media.file = `${baseUrl}media/catalog/product${media.file}`;
    });
  });
  return datasource.magentoProduct;
};

export const syncCatalog = async ({
  apiKey,
  datasourceId,
}: any): Promise<{
  savedProducts?: MagentoProduct[];
  updatedProducts?: MagentoProduct[];
}> => {
  try {
    const mgRes = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.GET_PRODUCTS,
    });

    const syncedAt = new Date();
    if (mgRes.data?.items?.length) {
      const savedProducts = await parseProductResponse(
        mgRes?.data as RawMagentoProduct,
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
