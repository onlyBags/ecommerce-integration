import { Article, SlotRes, Image } from '@dg-live/ecommerce-data-types';
import {
  AppDataSource,
  Datasource,
  MagentoProduct,
  Slot,
} from '@dg-live/ecommerce-db';
const slotRepository = AppDataSource.getRepository(Slot);
const dataSourceRepository = AppDataSource.getRepository(Datasource);

export const getAllSlots = async ({
  datasourceId,
}: {
  datasourceId: number;
}): Promise<SlotRes[]> => {
  try {
    const foundDatasource = await dataSourceRepository.findOne({
      where: {
        id: datasourceId,
      },
    });
    const foundSlots = await slotRepository.find({
      where: {
        datasource: {
          id: datasourceId,
        },
      },
      relations: {
        magentoProduct: {
          mediaGalleryEntries: true,
          customAttributes: true,
          extensionAttributes: true,
        },
      },
    });
    if (!foundSlots.length) return [];
    console.log(foundSlots);
    return mapToSlotsRes(foundDatasource, foundSlots);
  } catch (err) {
    throw err;
  }
};

const mapToSlotsRes = (datasource: Datasource, slots: Slot[]): SlotRes[] => {
  return slots.map((slot) => {
    let article: Article;
    const magentoProduct = { ...slot.magentoProduct };
    if (magentoProduct) {
      delete slot.magentoProduct;
      article = mapMagentoProductToArticle(datasource, magentoProduct);
    } else {
      throw new Error('Product type is not supported.');
    }

    return {
      ...slot,
      article,
    };
  });
};

function mapMagentoProductToArticle(
  datasource: Datasource,
  magentoProduct: MagentoProduct
): Article {
  const baseUrl = datasource.baseUrl;
  const images: Image[] = magentoProduct.mediaGalleryEntries.map(
    (entry) =>
      ({
        id: entry.id,
        src: `${baseUrl}/media/catalog/product${entry.file}`,
        name: entry.file.split('/').pop(),
        alt: entry.file.split('/').pop(),
      } as Image)
  );

  return {
    id: magentoProduct.id,
    productId: magentoProduct.productId,
    datasourceId: magentoProduct.datasourceId,
    name: magentoProduct.name,
    type: magentoProduct.typeId,
    description: '',
    shortDescription: '',
    sku: magentoProduct.sku,
    price: magentoProduct.price.toString(),
    regularPrice: magentoProduct.price.toString(),
    salePrice: '',
    shopType: 'magento',
    images,
    categories: [],
    attributes: [],
  };
}
