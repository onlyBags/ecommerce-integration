import { In } from 'typeorm';
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
  debugger;
  for (const woocommerceProduct of response) {
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const productData = woocommerceProduct;
        const product = new WoocommerceProduct();

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
        const categoriesToDelete: Category[] = [];
        const foundCategories = await findCategories(
          apiKey,
          datasourceId,
          productData.categories
        );
        if (!foundCategories.length) {
          for (const categoryData of productData.categories) {
            const category = new Category();
            category.categoryId = categoryData.id;
            category.name = categoryData.name;
            category.slug = categoryData.slug;
            const savedCategory = await transactionalEntityManager.save(
              category
            );
            categoriesToSave.push(savedCategory);
          }
        } else {
          for (const category of foundCategories) {
            const catToUpdate = product.categories.find(
              (x) => x.categoryId === category.categoryId
            );
            if (catToUpdate) {
              catToUpdate.name = category.name;
              catToUpdate.slug = category.slug;
              await transactionalEntityManager.save(catToUpdate);
            } else {
              categoriesToDelete.push(category);
            }
          }
        }
        if (categoriesToSave.length) product.categories = categoriesToSave;
        if (categoriesToDelete.length) {
          for (const category of categoriesToDelete) {
            await transactionalEntityManager.remove(category);
          }
        }

        const tagsToSave: Tag[] = [];
        const tagsToDelete: Tag[] = [];
        const foundTags = await findTags(
          apiKey,
          datasourceId,
          productData.tags
        );

        if (!foundTags.length) {
          for (const tagData of productData.tags) {
            const tag = new Tag();
            tag.tagId = tagData.id;
            tag.name = tagData.name;
            tag.slug = tagData.slug;
            const savedTag = await transactionalEntityManager.save(tag);
            tagsToSave.push(savedTag);
          }
        } else {
          for (const tag of foundTags) {
            const exists = product.tags.find((x) => x.tagId === tag.tagId);
            if (exists) {
              exists.name = tag.name;
              exists.slug = tag.slug;
              await transactionalEntityManager.save(exists);
            } else {
              tagsToDelete.push(tag);
            }
          }
        }
        if (tagsToSave.length) product.tags = tagsToSave;
        if (tagsToDelete.length) {
          for (const tag of tagsToDelete) {
            await transactionalEntityManager.remove(tag);
          }
        }

        let imagesToSave: Image[] = [];
        let imagesToDelete: Image[] = [];
        const foundIamges = await findImages(
          apiKey,
          datasourceId,
          productData.images
        );
        if (!foundIamges.length) {
          for (const imageData of productData.images) {
            const image = new Image();
            image.imageId = imageData.id;
            image.src = imageData.src;
            image.name = imageData.name;
            const savedImage = await transactionalEntityManager.save(image);
            imagesToSave.push(savedImage);
          }
        } else {
          for (const image of foundIamges) {
            const exists = product.images.find((x) => x.imageId === image.id);
            if (exists) {
              exists.src = image.src;
              exists.name = image.name;
              await transactionalEntityManager.save(exists);
            } else {
              imagesToDelete.push(image);
            }
          }
        }
        if (imagesToSave.length) product.images = imagesToSave;
        if (imagesToDelete.length) {
          for (const image of imagesToDelete) {
            await transactionalEntityManager.remove(image);
          }
        }

        let attributesToSave: Attribute[] = [];
        let attributesToDelete: Attribute[] = [];
        const foundAttributes = await findAttributes(
          apiKey,
          datasourceId,
          productData.attributes
        );

        if (!foundAttributes.length) {
          for (const attributeData of productData.attributes) {
            const attribute = new Attribute();
            attribute.attributeId = attributeData.id;
            attribute.name = attributeData.name;
            attribute.position = attributeData.position;
            attribute.visible = attributeData.visible;
            attribute.variation = attributeData.variation;
            attribute.options = JSON.stringify(attributeData.options); // Storing array as string
            const savedAttribute = await transactionalEntityManager.save(
              attribute
            );
            attributesToSave.push(savedAttribute);
          }
        } else {
          for (const attribute of foundAttributes) {
            const exists = product.attributes.find(
              (x) => x.attributeId === attribute.attributeId
            );
            if (exists) {
              exists.name = attribute.name;
              exists.position = attribute.position;
              exists.visible = attribute.visible;
              exists.variation = attribute.variation;
              exists.options = JSON.stringify(attribute.options);
              await transactionalEntityManager.save(exists);
            } else {
              attributesToDelete.push(attribute);
            }
          }
        }
        if (attributesToSave.length) product.attributes = attributesToSave;
        if (attributesToDelete.length) {
          for (const attribute of attributesToDelete) {
            await transactionalEntityManager.remove(attribute);
          }
        }

        const metaDataToSave: MetaData[] = [];
        const metaDataToDelete: MetaData[] = [];

        const foundMetaData = await findMetaData(
          apiKey,
          datasourceId,
          productData.meta_data
        );
        if (!foundMetaData.length) {
          for (const metaDataData of productData.meta_data) {
            const metaData = new MetaData();
            metaData.metaDataId = metaDataData.id;
            metaData.key = metaDataData.key;
            metaData.value = isJson(metaDataData.value)
              ? JSON.stringify(metaDataData.value)
              : metaDataData.value;
            const savedMetaData = await transactionalEntityManager.save(
              metaData
            );
            metaDataToSave.push(savedMetaData);
          }
        } else {
          for (const metaData of foundMetaData) {
            const exists = product.metaData.find(
              (x) => x.metaDataId === metaData.metaDataId
            );
            if (exists) {
              exists.key = metaData.key;
              exists.value = isJson(metaData.value)
                ? JSON.stringify(metaData.value)
                : metaData.value;
              await transactionalEntityManager.save(exists);
            } else {
              metaDataToDelete.push(metaData);
            }
          }
        }
        if (metaDataToSave.length) product.metaData = metaDataToSave;
        if (metaDataToDelete.length) {
          for (const metaData of metaDataToDelete) {
            await transactionalEntityManager.remove(metaData);
          }
        }

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
        data.push(product);
      }
    );
  }
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

const findCategories = async (
  apiKey: string,
  datasourceId: number,
  categories: CategoryRes[]
) => {
  const foundCategories = await userRepository.findOne({
    relations: {
      datasource: {
        woocommerceProduct: {
          categories: true,
        },
      },
    },
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
        woocommerceProduct: {
          categories: {
            categoryId: In(categories.map((category) => category.id)),
          },
        },
      },
    },
  });
  if (
    foundCategories &&
    foundCategories.datasource[0].woocommerceProduct[0].categories
  )
    return foundCategories.datasource[0].woocommerceProduct[0].categories;
  return [];
};

const findTags = async (
  apiKey: string,
  datasourceId: number,
  tags: TagRes[]
) => {
  const foundTags = await userRepository.findOne({
    relations: {
      datasource: {
        woocommerceProduct: {
          tags: true,
        },
      },
    },
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
        woocommerceProduct: {
          tags: {
            tagId: In(tags.map((tag) => tag.id)),
          },
        },
      },
    },
  });
  if (foundTags && foundTags.datasource[0].woocommerceProduct[0].tags)
    return foundTags.datasource[0].woocommerceProduct[0].tags;
  return [];
};

const findImages = async (
  apiKey: string,
  datasourceId: number,
  images: ImageRes[]
) => {
  const foundImages = await userRepository.findOne({
    relations: {
      datasource: {
        woocommerceProduct: {
          images: true,
        },
      },
    },
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
        woocommerceProduct: {
          images: {
            src: In(images.map((image) => image.src)),
          },
        },
      },
    },
  });
  if (foundImages && foundImages.datasource[0].woocommerceProduct[0].images)
    return foundImages.datasource[0].woocommerceProduct[0].images;
  return [];
};

const findAttributes = async (
  apiKey: string,
  datasourceId: number,
  attributes: AttributeRes[]
) => {
  const foundAttributes = await userRepository.findOne({
    relations: {
      datasource: {
        woocommerceProduct: {
          attributes: true,
        },
      },
    },
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
        woocommerceProduct: {
          attributes: {
            attributeId: In(attributes.map((attribute) => attribute.id)),
          },
        },
      },
    },
  });
  if (
    foundAttributes &&
    foundAttributes.datasource[0].woocommerceProduct[0].attributes
  )
    return foundAttributes.datasource[0].woocommerceProduct[0].attributes;
  return [];
};

const findMetaData = async (
  apiKey: string,
  datasourceId: number,
  metadata: MetaDataRes[]
) => {
  const foundMetaData = await userRepository.findOne({
    relations: {
      datasource: {
        woocommerceProduct: {
          metaData: true,
        },
      },
    },
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
        woocommerceProduct: {
          metaData: {
            metaDataId: In(metadata.map((meta) => meta.id)),
          },
        },
      },
    },
  });
  if (
    foundMetaData &&
    foundMetaData.datasource[0].woocommerceProduct[0].metaData
  )
    return foundMetaData.datasource[0].woocommerceProduct[0].metaData;
  return [];
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
