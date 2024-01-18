import oAuth from 'oauth-1.0a';
import { createHmac } from 'crypto';
import axios from 'axios';
import {
  AppDataSource,
  User,
  MagentoProduct,
  MagentoMediaGalleryEntry,
  MagentoExtensionAttributes,
  MagentoCategoryLink,
  MagentoConfigurableProductOptions,
} from '@dg-live/ecommerce-db';
import {
  MgActions,
  RawMagentoMediaGalleryEntry,
  RawMagentoProduct,
  RawMagentoCategory,
  RawMagentoExtensionAttributes,
} from '@dg-live/ecommerce-data-types';
// import { MgActions } from '@dg-live/ecommerce-data-types';

const userRepository = AppDataSource.getRepository(User);
const mediaGalleryEntriesRepository = AppDataSource.getRepository(
  MagentoMediaGalleryEntry
);
const extensionAttributesRepository = AppDataSource.getRepository(
  MagentoExtensionAttributes
);

const configurableProductOptionsRepository = AppDataSource.getRepository(
  MagentoConfigurableProductOptions
);
const categoryLinkRepository = AppDataSource.getRepository(MagentoCategoryLink);
const productRepository = AppDataSource.getRepository(MagentoProduct);

export const magentoApi = async ({
  apiKey,
  datasourceId,
  action,
}: {
  apiKey: string;
  datasourceId: number;
  action: MgActions;
}): Promise<any> => {
  const foundUserDatasource = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUserDatasource) throw new Error("User's datasource not found");
  const {
    baseUrl,
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret,
  } = foundUserDatasource.datasource[0];

  const simpleTryData = {
    url: `${baseUrl}/rest/V1/${action}`,
    method: 'GET',
  };
  const simpleTryAccess = new oAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return createHmac('sha256', key)
        .update(base_string)
        .digest('base64')
        .toString();
    },
  });

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };
  const simpleTryAuthHeader = simpleTryAccess.toHeader(
    simpleTryAccess.authorize(simpleTryData, token)
  );
  try {
    const res = await axios.get(simpleTryData.url, {
      headers: {
        ...simpleTryAuthHeader,
      },
    });
    if (res.data) return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
// 0o2fy5fznnlijdr4ii1zx9mvrmva2y85
// 9qu2jdrp4w2ctgvpcg35j6oidd0oza9c
// 58pmkyu7ebkiof1uznufhx0awnoxogzr
// kzeejctuncpsy2g46ehzdj6bb9w5gsvp

export const parseProductResponse = async (
  response: RawMagentoProduct,
  apiKey: string,
  datasourceId: number,
  updatedAt: Date
): Promise<MagentoProduct[]> => {
  const data: MagentoProduct[] = [];
  const RawMagentoCategory: RawMagentoCategory[] = await magentoApi({
    apiKey,
    datasourceId,
    action: MgActions.GET_CATEGORIES_LIST,
  });
  for (const rawMagentoProduct of response.items) {
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const productData = rawMagentoProduct;
        const foundUserProduct = await userRepository.findOne({
          relations: {
            datasource: {
              magentoProduct: true,
            },
          },
          where: {
            apiKey,
            datasource: {
              id: datasourceId,
              magentoProduct: {
                productId: productData.id,
              },
            },
          },
        });
        let foundProduct: MagentoProduct;
        if (
          foundUserProduct &&
          foundUserProduct.datasource &&
          foundUserProduct.datasource.length &&
          foundUserProduct.datasource[0].magentoProduct.length
        ) {
          foundProduct = foundUserProduct.datasource[0].magentoProduct[0];
        }
        const product = foundProduct || new MagentoProduct();
        product.productId = productData.id;
        product.datasourceId = datasourceId;
        product.sku = productData.sku;
        product.name = productData.name;
        product.attributeSetId = productData.attribute_set_id;
        product.price = productData.price;
        product.status = productData.status;
        product.visibility = productData.visibility;
        product.typeId = productData.type_id;
        product.createdAt = new Date(productData.created_at);
        product.updatedAt = updatedAt;
        product.weight = productData.weight;

        let extensionAttributesToSave: MagentoExtensionAttributes =
          new MagentoExtensionAttributes();
        let extensionAttributesToAdd: RawMagentoExtensionAttributes;
        let categoriesLinkToSave: MagentoCategoryLink[] = [];
        let websiteIdsToSave: number[] = [];
        let configurableProductLinksToSave: number[] = [];
        const extensionAttributes = await findExtensionAttributes(
          apiKey,
          datasourceId,
          product.productId
        );
        if (!extensionAttributes) {
          extensionAttributesToAdd = productData.extension_attributes;
          if (extensionAttributesToAdd.website_ids.length) {
            extensionAttributesToAdd.website_ids.forEach((x) => {
              websiteIdsToSave.push(x);
            });
            extensionAttributesToSave.websiteIds = websiteIdsToSave;
          }
          if (extensionAttributesToAdd?.configurable_product_links?.length) {
            extensionAttributesToAdd.configurable_product_links.forEach((x) => {
              configurableProductLinksToSave.push(x);
            });

            extensionAttributesToSave.configurableProductLinks =
              configurableProductLinksToSave;
            await extensionAttributesRepository.save(extensionAttributesToSave);

            if (extensionAttributesToAdd.configurable_product_options?.length) {
              for (const option of extensionAttributesToAdd.configurable_product_options) {
                const configurableProductOption =
                  new MagentoConfigurableProductOptions();
                configurableProductOption.configurableProductId = option.id;
                configurableProductOption.attributeId = option.attribute_id;
                configurableProductOption.label = option.label;
                configurableProductOption.position = option.position;
                configurableProductOption.productId = option.product_id;
                configurableProductOption.values = option.values.map(
                  (x) => x.value_index
                );
                configurableProductOption.extensionAttributes =
                  extensionAttributesToSave;
                await configurableProductOptionsRepository.save(
                  configurableProductOption
                );
              }
            }
          }

          await extensionAttributesRepository.save(extensionAttributesToSave);

          if (extensionAttributesToAdd.category_links.length) {
            extensionAttributesToAdd.category_links.forEach((x) => {
              const categoryLink = new MagentoCategoryLink();
              categoryLink.categoryId = x.category_id;
              categoryLink.position = x.position;
              categoryLink.extensionAttributes = extensionAttributesToSave;
              categoriesLinkToSave.push(categoryLink);
            });
            await categoryLinkRepository.save(categoriesLinkToSave);
          }
        } else {
          const foundExtensionAttributes =
            await extensionAttributesRepository.findOne({
              relations: {
                configurableProductLinks: true,
              },
              where: {
                id: extensionAttributes.id,
              },
            });
          console.log(foundExtensionAttributes);
          debugger;
        }
        if (Object.keys(extensionAttributesToSave).length)
          product.extensionAttributes = extensionAttributesToSave;

        const mediaToSave: MagentoMediaGalleryEntry[] = [];
        let mediasToAdd: RawMagentoMediaGalleryEntry[] = [];
        const foundMedia = await findMedia(datasourceId);
        if (!foundMedia.length) mediasToAdd = productData.media_gallery_entries;
        else {
          try {
            mediasToAdd = productData.media_gallery_entries.filter(
              (x) => !foundMedia.find((y) => y.mediaId === x.id)
            );
          } catch (err) {
            console.log(err);
            debugger;
          }
        }
        for (const mediaToAdd of mediasToAdd) {
          const media = new MagentoMediaGalleryEntry();
          media.mediaId = mediaToAdd.id;
          media.mediaType = mediaToAdd.media_type;
          media.label = mediaToAdd.label;
          media.position = mediaToAdd.position;
          media.disabled = mediaToAdd.disabled;
          media.types = mediaToAdd.types;
          media.file = mediaToAdd.file;
          const savedMedia = await transactionalEntityManager.save(media);
          mediaToSave.push(savedMedia);
        }
        if (mediaToSave.length) product.mediaGalleryEntries = mediaToSave;

        const savedWoocommerceProduct = await transactionalEntityManager.save(
          product
        );
        data.push(savedWoocommerceProduct);
      }
    );
  }

  return data;
};
const findExtensionAttributes = async (
  apiKey: string,
  datasourceId: number,
  productId: number
) => {
  const foundProduct = await productRepository.findOne({
    relations: {
      extensionAttributes: true,
      datasource: {
        user: true,
      },
    },
    where: {
      productId,
      datasource: {
        id: datasourceId,
        user: {
          apiKey,
        },
      },
    },
  });

  return foundProduct?.extensionAttributes || null;
};

const findMedia = async (datasourceId: number) => {
  const foundMedia = mediaGalleryEntriesRepository.find({
    relations: {
      magentoProduct: {
        datasource: true,
      },
    },
    where: {
      magentoProduct: {
        datasource: {
          id: datasourceId,
        },
      },
    },
  });

  return foundMedia;
};
