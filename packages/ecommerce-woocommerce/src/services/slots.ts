import { Article, Image, SlotRes } from '@dg-live/ecommerce-data-types';
import { AppDataSource, Slot, WoocommerceProduct } from '@dg-live/ecommerce-db';
const slotRepository = AppDataSource.getRepository(Slot);

export const getAllSlots = async ({
  datasourceId,
}: {
  datasourceId: number;
}): Promise<SlotRes[]> => {
  try {
    const foundSlots = await slotRepository.find({
      where: {
        datasource: {
          id: datasourceId,
        },
      },
      relations: {
        woocommerceProduct: {
          attributes: {
            options: true,
          },
          images: true,
          categories: true,
        },
      },
    });
    if (!foundSlots.length) return [];
    console.log(foundSlots);
    return mapToSlotsRes(foundSlots);
  } catch (err) {
    throw err;
  }
};

const mapToSlotsRes = (slots: Slot[]): SlotRes[] => {
  return slots.map((slot) => {
    const woocommerceProduct = { ...slot.woocommerceProduct };
    delete slot.woocommerceProduct;
    return {
      ...slot,
      article: mapWooCommerceProductToArticle(woocommerceProduct),
    };
  });
};

function mapWooCommerceProductToArticle(
  woocommerceProduct: WoocommerceProduct
): Article {
  const images: Image[] = woocommerceProduct?.images?.map(
    (image) =>
      ({
        id: image.id,
        src: image.src,
        name: image.name,
        alt: image.alt,
      } as Image)
  );

  return {
    id: woocommerceProduct.id,
    productId: woocommerceProduct.productId,
    datasourceId: woocommerceProduct.datasourceId,
    name: woocommerceProduct.name,
    type: woocommerceProduct.type,
    description: woocommerceProduct.description,
    shortDescription: woocommerceProduct.shortDescription,
    sku: woocommerceProduct.sku,
    price: woocommerceProduct.price,
    regularPrice: woocommerceProduct.regularPrice,
    salePrice: woocommerceProduct.salePrice,
    shopType: 'woocommerce',
    images,
    categories: woocommerceProduct?.categories?.map((category: any) => ({
      id: category.id,
      categoryId: category.categoryId,
      name: category.name,
      slug: category.slug,
    })),
    attributes: woocommerceProduct?.attributes?.map((attribute: any) => {
      return {
        id: attribute.id,
        attributeId: attribute.attributeId,
        name: attribute.name,
        position: attribute.position,
        visible: attribute.visible,
        variation: attribute.variation,
        options: attribute?.options?.map((option: any) => {
          return {
            id: option.id,
            value: option.value,
          };
        }),
      };
    }),
  };
}
