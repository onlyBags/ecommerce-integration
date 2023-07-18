import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { AppDataSource, User } from '@dg-live/ecommerce-db';
import { ProductVariation, ProductVariationRes } from '../interfaces/index.js';
const userRepository = AppDataSource.getRepository(User);

export const getProductVariation = async ({
  apiKey,
  datasourceId,
  productId,
  attributes,
  values,
}: {
  apiKey: string;
  datasourceId: number;
  productId: number;
  attributes: string[];
  values: string[];
}): Promise<ProductVariation | false> => {
  try {
    const foundUserDatasource = await userRepository.findOne({
      where: { apiKey, datasource: { id: datasourceId } },
      relations: ['datasource'],
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
    return res.data ? mapProductVariation(res.data) : false;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const mapProductVariation = (
  productVariationRes: ProductVariationRes
): ProductVariation => {
  return {
    backordersAllowed: productVariationRes.backorders_allowed,
    dimensions: productVariationRes.dimensions,
    price: productVariationRes.display_price,
    regularPrice: productVariationRes.display_regular_price,
    image: productVariationRes.image,
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
