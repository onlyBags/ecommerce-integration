import { magentoApi, parseProductResponse } from '../utils/index.js';
import { MgActions, RawMagentoProduct } from '@dg-live/ecommerce-data-types';
import {
  AppDataSource,
  MagentoProduct,
  Datasource,
  Slot,
} from '@dg-live/ecommerce-db';

const datasourceRepository = AppDataSource.getRepository(Datasource);
const slotRepository = AppDataSource.getRepository(Slot);

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

    const mgProductAndSlots = [];
    for (const prd of foundDatasource.magentoProduct) {
      const foundSlot = await slotRepository.findOne({
        relations: {
          datasource: true,
          magentoProduct: true,
        },
        where: {
          datasource: { id: datasourceId },
          magentoProduct: {
            productId: prd.productId,
          },
        },
      });
      if (foundSlot) {
        delete foundSlot.datasource;
        delete foundSlot.woocommerceProduct;
        delete foundSlot.magentoProduct;
      }
      mgProductAndSlots.push({
        ...prd,
        slot: foundSlot || null,
      });
    }
    // return mgProductAndSlots;
    return addImageBaseUrl(foundDatasource.baseUrl, mgProductAndSlots);
  } catch (err) {
    throw err;
  }
};

const addImageBaseUrl = (baseUrl: string, magentoProduct: MagentoProduct[]) => {
  magentoProduct.forEach((product: any) => {
    const images = [];
    product.mediaGalleryEntries.forEach((media) => {
      media.file = `${baseUrl}/media/catalog/product${media.file}`;
      images.push({
        ...media,
        src: `${baseUrl}/media/catalog/product${media.file}`,
      });
    });
    product.images = images;
  });
  return magentoProduct;
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
