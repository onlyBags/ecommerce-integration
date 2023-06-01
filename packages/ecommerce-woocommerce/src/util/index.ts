import { In } from 'typeorm';
import { createHash } from 'crypto';
import {
  AppDataSource,
  User,
  WoocommerceProduct,
  Category,
  Tag,
  Image,
  Attribute,
  Dimensions,
  MetaData,
} from '@dg-live/ecommerce-db';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import {
  WoocommerceProductRes,
  CategoryRes,
  TagRes,
  ImageRes,
  AttributeRes,
  MetaDataRes,
} from '../interfaces/index.js';

const WooCommerceRest = WooCommerceRestApi.default;
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);
const tagRepository = AppDataSource.getRepository(Tag);
const imageRepository = AppDataSource.getRepository(Image);
const attributeRepository = AppDataSource.getRepository(Attribute);
const dimensionRepository = AppDataSource.getRepository(Dimensions);
const metaDataRepository = AppDataSource.getRepository(MetaData);

export const createNewWoocommerceInstance = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}): Promise<InstanceType<typeof WooCommerceRest> | null> => {
  const foundUserDatasource = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUserDatasource) throw new Error("User's datasource not found");

  const { baseUrl, consumerKey, consumerSecret } =
    foundUserDatasource.datasource[0];

  const WooCommerceApi = new WooCommerceRest({
    url: baseUrl,
    consumerKey,
    consumerSecret,
    version: 'wc/v3',
  });
  return WooCommerceApi;
};

export const parseProductResponse = async (
  response: WoocommerceProductRes[],
  apiKey: string,
  datasourceId: number,
  syncedAt: Date
): Promise<WoocommerceProduct[]> => {
  const data: WoocommerceProduct[] = [];
  for (const woocommerceProduct of response) {
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const productData = woocommerceProduct;
        debugger;
        const foundUserProduct = await userRepository.findOne({
          relations: {
            datasource: {
              woocommerceProduct: {
                attributes: true,
                categories: true,
                dimensions: true,
                images: true,
                tags: true,
                metaData: true,
              },
            },
          },
          where: {
            apiKey,
            datasource: {
              id: datasourceId,
              woocommerceProduct: {
                productId: productData.id,
              },
            },
          },
        });
        let foundProduct: WoocommerceProduct;
        if (
          foundUserProduct &&
          foundUserProduct.datasource &&
          foundUserProduct.datasource.length &&
          foundUserProduct.datasource[0].woocommerceProduct.length
        ) {
          foundProduct = foundUserProduct.datasource[0].woocommerceProduct[0];
        }
        const product = foundProduct || new WoocommerceProduct();

        product.productId = productData.id;
        product.syncedAt = syncedAt;
        product.datasourceId = datasourceId;
        product.name = productData.name;
        product.slug = productData.slug;
        product.permalink = productData.permalink;
        product.dateCreated = productData.date_created;
        product.dateModified = productData.date_modified;
        product.type = productData.type;
        product.status = productData.status;
        product.featured = productData.featured;
        product.catalogVisibility = productData.catalog_visibility;
        product.description = productData.description;
        product.shortDescription = productData.short_description;
        product.sku = productData.sku;
        product.price = productData.price;
        product.regularPrice = productData.regular_price;
        product.salePrice = productData.sale_price;
        product.onSale = productData.on_sale;
        product.purchasable = productData.purchasable;
        product.totalSales = productData.total_sales;
        product.virtual = productData.virtual;
        product.downloadable = productData.downloadable;
        product.taxStatus = productData.tax_status;
        product.manageStock = productData.manage_stock;
        product.stockStatus = productData.stock_status;
        product.weight = productData.weight;

        let dimensionToSave: Dimensions;
        const dimension = new Dimensions();
        const foundDimension = await findDimension(apiKey, datasourceId, {
          width: productData.dimensions.width,
          height: productData.dimensions.height,
          length: productData.dimensions.length,
        });

        if (foundDimension) dimensionToSave = foundDimension;
        else {
          dimension.length = productData.dimensions.length || '0';
          dimension.width = productData.dimensions.width || '0';
          dimension.height = productData.dimensions.height || '0';
          dimensionToSave = await transactionalEntityManager.save(dimension);
        }
        product.dimensions = dimensionToSave;

        const categoriesToSave: Category[] = [];
        let categoriesToAdd: CategoryRes[] = [];
        const foundCategories = await findCategories(apiKey, datasourceId);
        if (!foundCategories.length) categoriesToAdd = productData.categories;
        else {
          try {
            categoriesToAdd = productData.categories.filter(
              (x) => !foundCategories.find((y) => y.categoryId === x.id)
            );
          } catch (error) {
            console.log(error);
            debugger;
          }
        }
        for (const categorieToAdd of categoriesToAdd) {
          const category = new Category();
          category.categoryId = categorieToAdd.id;
          category.name = categorieToAdd.name;
          category.slug = categorieToAdd.slug;
          const savedCategory = await transactionalEntityManager.save(category);
          categoriesToSave.push(savedCategory);
        }
        if (categoriesToSave.length) product.categories = categoriesToSave;

        const tagsToSave: Tag[] = [];
        let tagsToAdd: TagRes[] = [];
        const foundTags = await findTags(apiKey, datasourceId);
        if (!foundTags.length) tagsToAdd = productData.tags;
        else {
          try {
            tagsToAdd = productData.tags.filter(
              (x) => !foundTags.find((y) => y.tagId === x.id)
            );
          } catch (err) {
            console.log(err);
            debugger;
          }
        }
        for (const tagToAdd of tagsToAdd) {
          const tag = new Tag();
          tag.tagId = tagToAdd.id;
          tag.name = tagToAdd.name;
          tag.slug = tagToAdd.slug;
          const savedTag = await transactionalEntityManager.save(tag);
          tagsToSave.push(savedTag);
        }

        if (tagsToSave.length) product.tags = tagsToSave;

        const imagesToSave: Image[] = [];
        let imagesToAdd: ImageRes[] = [];
        const foundIamges = await findImages(apiKey, datasourceId);
        if (!foundIamges.length) imagesToAdd = productData.images;
        else {
          try {
            imagesToAdd = productData.images.filter(
              (x) => !foundIamges.find((y) => y.imageId === x.id)
            );
          } catch (err) {
            console.log(err);
            debugger;
          }
        }
        for (const imageToAdd of imagesToAdd) {
          const image = new Image();
          image.imageId = imageToAdd.id;
          image.src = imageToAdd.src;
          image.name = imageToAdd.name;
          const savedImage = await transactionalEntityManager.save(image);
          imagesToSave.push(savedImage);
        }
        if (imagesToSave.length) product.images = imagesToSave;

        let attributesToSave: Attribute[] = [];
        let attributesToAdd: AttributeRes[] = [];
        const foundAttributes = await findAttributes(apiKey, datasourceId);
        if (!foundAttributes.length) {
          attributesToAdd = productData.attributes;
        } else {
          try {
            attributesToAdd = productData.attributes.filter(
              (x) => !foundAttributes.find((y) => y.attributeId === x.id)
            );
          } catch (err) {
            console.log(err);
            debugger;
          }
        }
        for (const attrubuteToAdd of attributesToAdd) {
          const attribute = new Attribute();
          attribute.attributeId = attrubuteToAdd.id;
          attribute.name = attrubuteToAdd.name;
          attribute.position = attrubuteToAdd.position;
          attribute.visible = attrubuteToAdd.visible;
          attribute.variation = attrubuteToAdd.variation;
          attribute.options = JSON.stringify(attrubuteToAdd.options); // Storing array as string
          const savedAttribute = await transactionalEntityManager.save(
            attribute
          );
          attributesToSave.push(savedAttribute);
        }

        if (attributesToSave.length) product.attributes = attributesToSave;

        const metaDataToSave: MetaData[] = [];
        let metaDataToAdd: MetaDataRes[] = [];

        const foundMetaData = await findMetaData(apiKey, datasourceId);
        if (!foundMetaData.length) {
          metaDataToAdd = productData.meta_data;
        } else {
          try {
            metaDataToAdd = productData.meta_data.filter(
              (x) => !foundMetaData.find((y) => y.metaDataId === x.id)
            );
          } catch (err) {
            console.log(err);
            debugger;
          }
        }

        for (const meta of metaDataToAdd) {
          const metaData = new MetaData();
          metaData.metaDataId = meta.id;
          metaData.key = meta.key;
          metaData.value = isJson(meta.value)
            ? JSON.stringify(meta.value)
            : meta.value;
          const savedMetaData = await transactionalEntityManager.save(metaData);
          metaDataToSave.push(savedMetaData);
        }

        if (metaDataToSave.length) product.metaData = metaDataToSave;

        product.downloadLimit = productData.download_limit;
        product.downloadExpiry = productData.download_expiry;
        product.externalUrl = productData.external_url;
        product.buttonText = productData.button_text;
        product.taxClass = productData.tax_class;
        product.stockQuantity = productData.stock_quantity;
        product.backorders = productData.backorders;
        product.backordersAllowed = productData.backorders_allowed;
        product.backordered = productData.backordered;
        product.soldIndividually = productData.sold_individually;
        product.shippingRequired = productData.shipping_required;
        product.shippingTaxable = productData.shipping_taxable;
        product.shippingClass = productData.shipping_class;
        product.shippingClassId = productData.shipping_class_id;
        product.reviewsAllowed = productData.reviews_allowed;
        product.averageRating = productData.average_rating;
        product.ratingCount = productData.rating_count;
        product.relatedIds = JSON.stringify(productData.related_ids);
        product.upsellIds = JSON.stringify(productData.upsell_ids);
        product.crossSellIds = JSON.stringify(productData.cross_sell_ids);
        product.parentId = productData.parent_id;
        product.purchaseNote = productData.purchase_note;
        product.variations = JSON.stringify(productData.variations);
        product.groupedProducts = JSON.stringify(productData.grouped_products);
        product.menuOrder = productData.menu_order;
        const savedWoocommerceProduct = await transactionalEntityManager.save(
          product
        );
        data.push(savedWoocommerceProduct);
      }
    );
  }
  debugger;
  return data;
};

const findDimension = async (
  apiKey: string,
  datasourceId: number,
  dimensions: {
    width: string;
    height: string;
    length: string;
  }
): Promise<Dimensions | null> => {
  const foundItem = await userRepository.findOne({
    relations: {
      datasource: {
        woocommerceProduct: {
          dimensions: true,
        },
      },
    },
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
        woocommerceProduct: {
          dimensions: {
            width: dimensions.width,
            height: dimensions.height,
            length: dimensions.length,
          },
        },
      },
    },
  });
  if (foundItem && foundItem.datasource[0].woocommerceProduct[0].dimensions)
    return foundItem.datasource[0].woocommerceProduct[0].dimensions;
  return null;
};

const findCategories = async (apiKey: string, datasourceId: number) => {
  const categories = await categoryRepository.find({
    relations: {
      woocommerceProduct: {
        datasource: {
          user: true,
        },
      },
    },
    where: {
      woocommerceProduct: {
        datasource: {
          id: datasourceId,
          user: {
            apiKey,
          },
        },
      },
    },
  });
  return categories;
};

const findTags = async (apiKey: string, datasourceId: number) => {
  const found = tagRepository.find({
    relations: {
      woocommerceProduct: {
        datasource: {
          user: true,
        },
      },
    },
    where: {
      woocommerceProduct: {
        datasource: {
          id: datasourceId,
          user: {
            apiKey,
          },
        },
      },
    },
  });
  return found;
};

const findImages = async (apiKey: string, datasourceId: number) => {
  const found = await imageRepository.find({
    relations: {
      woocommerceProduct: {
        datasource: {
          user: true,
        },
      },
    },
    where: {
      woocommerceProduct: {
        datasource: {
          id: datasourceId,
          user: {
            apiKey,
          },
        },
      },
    },
  });
  return found;
};

const findAttributes = async (apiKey: string, datasourceId: number) => {
  const attributes = await attributeRepository.find({
    relations: {
      woocommerceProduct: {
        datasource: {
          user: true,
        },
      },
    },
    where: {
      woocommerceProduct: {
        datasource: {
          id: datasourceId,
          user: {
            apiKey,
          },
        },
      },
    },
  });
  return attributes;
};

const findMetaData = async (apiKey: string, datasourceId: number) => {
  const metaData = await metaDataRepository.find({
    relations: {
      woocommerceProduct: {
        datasource: {
          user: true,
        },
      },
    },
    where: {
      woocommerceProduct: {
        datasource: {
          id: datasourceId,
          user: {
            apiKey,
          },
        },
      },
    },
  });
  return metaData;
};

export const isJson = (val: string | object) => {
  if (typeof val !== 'string') {
    try {
      JSON.stringify(val);
    } catch (e) {
      return false;
    }
    return true;
  } else {
    try {
      JSON.parse(val);
    } catch (e) {
      return false;
    }
    return true;
  }
};
