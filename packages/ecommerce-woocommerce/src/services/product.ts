import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { AppDataSource, Image, User } from '@dg-live/ecommerce-db';
import {
  ProductVariation,
  ProductVariationRes,
} from '@dg-live/ecommerce-data-types';
const userRepository = AppDataSource.getRepository(User);

const imageRepository = AppDataSource.getRepository(Image);
export const getProductVariation = async ({
  datasourceId,
  productId,
  attributes,
  values,
}: {
  datasourceId: number;
  productId: number;
  attributes: string[];
  values: string[];
}): Promise<ProductVariation | false> => {
  try {
    const foundUserDatasource = await userRepository.findOne({
      where: { datasource: { id: datasourceId } },
      relations: {
        datasource: true,
      },
    });
    if (!foundUserDatasource) throw new Error("User's datasource not found");

    const { baseUrl, consumerKey, consumerSecret } =
      foundUserDatasource.datasource[0];
    const url = `${baseUrl}?wc-ajax=get_variation`;
    const form = new FormData();
    form.append('product_id', productId.toString());
    attributes.forEach((attribute, index) => {
      form.append(`attribute_${attribute}`, values[index]);
    });

    const res = await axios.post<ProductVariationRes | false>(url, form, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });
    return res.data ? await mapProductVariation(productId, res.data) : false;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const mapProductVariation = async (
  productId: number,
  productVariationRes: ProductVariationRes
): Promise<ProductVariation> => {
  const images = await imageRepository.find({
    where: {
      woocommerceProduct: {
        productId,
      },
    },
    relations: {
      woocommerceProduct: true,
    },
  });
  return {
    backordersAllowed: productVariationRes.backorders_allowed,
    dimensions: productVariationRes.dimensions,
    price: productVariationRes.display_price,
    regularPrice: productVariationRes.display_regular_price,
    images: [
      {
        id: productVariationRes.image_id,
        dateCreated: '01/01/2021',
        dateModified: '01/01/2021',
        imageId: productVariationRes.image_id,
        src: productVariationRes.image.src,
        dateCreatedGmt: null,
        dateModifiedGmt: null,
        name: productVariationRes.image.title,
        alt: productVariationRes.image.alt,
        woocommerceProduct: images.length ? images[0].woocommerceProduct : null,
      },
      ...images,
    ],
    imageId: productVariationRes.image_id,
    isDownloadable: productVariationRes.is_downloadable,
    isInStock: productVariationRes.is_in_stock,
    isPurchasable: productVariationRes.is_purchasable,
    isSoldIndividually: productVariationRes.is_sold_individually,
    isVirtual: productVariationRes.is_virtual,
    maxQty: productVariationRes.max_qty,
    minQty: productVariationRes.min_qty,
    sku: productVariationRes.sku,
    variationDescription: productVariationRes.variation_description,
    id: productVariationRes.variation_id,
    isActive: productVariationRes.variation_is_active,
    isVisible: productVariationRes.variation_is_visible,
    weight: productVariationRes.weight,
  };
};
