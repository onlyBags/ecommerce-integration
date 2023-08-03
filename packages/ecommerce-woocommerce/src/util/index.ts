import { Equal, In, Like } from 'typeorm';
import {
  AppDataSource,
  User,
  WoocommerceProduct,
  Category,
  Tag,
  Image,
  Attribute,
  AttributeOption,
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
} from '@dg-live/ecommerce-data-types';
import { datasourceCacheRepository } from '@dg-live/ecommerce-cache';
import { Entity, EntityId } from 'redis-om';

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
  let foundCached: Entity[];
  let wooCommerceApi: InstanceType<typeof WooCommerceRest>;
  try {
    foundCached = await datasourceCacheRepository
      .search()
      .where('apiKey')
      .eq(apiKey)
      .where('datasourceId')
      .eq(datasourceId)
      .return.all();
  } catch (error) {
    console.log('error in cache search', error);
  }
  if (foundCached.length) {
    console.log(foundCached[0]);
    const { consumerKey, consumerSecret, baseUrl } = foundCached[0] as {
      consumerKey: string;
      consumerSecret: string;
      baseUrl: string;
    };
    wooCommerceApi = new WooCommerceRest({
      url: baseUrl,
      consumerKey,
      consumerSecret,
      version: 'wc/v3',
    });
  } else {
    const foundUserDatasource = await userRepository.findOne({
      where: { apiKey, datasource: { id: datasourceId } },
      relations: ['datasource'],
    });
    if (!foundUserDatasource) throw new Error("User's datasource not found");

    const { baseUrl, consumerKey, consumerSecret } =
      foundUserDatasource.datasource[0];
    try {
      const cachedEntity = await datasourceCacheRepository.save({
        apiKey,
        datasourceId,
        consumerKey,
        consumerSecret,
        baseUrl,
      });
      const ttlInSeconds = 60 * 5; // 5 minutes
      await datasourceCacheRepository.expire(
        cachedEntity[EntityId],
        ttlInSeconds
      );
    } catch (error) {
      console.log('Error saving in cache');
    }
    wooCommerceApi = new WooCommerceRest({
      url: baseUrl,
      consumerKey,
      consumerSecret,
      version: 'wc/v3',
    });
  }
  return wooCommerceApi;
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
        const foundDimension = await findDimension(
          apiKey,
          datasourceId,
          foundProduct?.id || null,
          {
            width: productData.dimensions.width || '0',
            height: productData.dimensions.height || '0',
            length: productData.dimensions.length || '0',
          }
        );
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

        // Existing attributes
        let foundAttributes = await findAttributes(
          apiKey,
          datasourceId,
          product.productId
        );

        // Attributes to be added and updated
        let attributesToAddOrUpdate: AttributeRes[] = productData.attributes;

        // Iterate over each attribute to add or update
        for (const attributeToAddOrUpdate of attributesToAddOrUpdate) {
          // Check if this attribute exists already
          let existingAttribute = foundAttributes.find(
            (attr) => attr.attributeId === attributeToAddOrUpdate.id
          );

          // If the attribute doesn't exist, create a new one
          if (!existingAttribute) {
            existingAttribute = new Attribute();
            existingAttribute.attributeId = attributeToAddOrUpdate.id;
            existingAttribute.name = attributeToAddOrUpdate.name;
            existingAttribute.position = attributeToAddOrUpdate.position;
            existingAttribute.visible = attributeToAddOrUpdate.visible;
            existingAttribute.variation = attributeToAddOrUpdate.variation;

            // Save the attribute
            existingAttribute = await transactionalEntityManager.save(
              existingAttribute
            );
          }

          // Now, for each option, check if it exists for this attribute, if not, add it
          for (const optionToAdd of attributeToAddOrUpdate.options) {
            let existingOption = await transactionalEntityManager.findOne(
              AttributeOption,
              {
                where: {
                  value: Like(`%${optionToAdd}%`), // updated to use Like operator
                  attribute: Equal(existingAttribute.id), // here we use the ID of the saved attribute
                },
              }
            );
            // If this option doesn't exist, create a new one
            if (!existingOption) {
              existingOption = new AttributeOption();
              existingOption.value = [optionToAdd];
              existingOption.attribute = existingAttribute;

              existingOption = await transactionalEntityManager.save(
                existingOption
              );
            }
          }

          // Add the attribute to the list to be saved to the product
          attributesToSave.push(existingAttribute);
        }

        // Update the product's attributes
        if (attributesToSave.length) {
          product.attributes = attributesToSave;
        }
        /*
        let attributesToSave: Attribute[] = [];
        let attributesToAdd: AttributeRes[] = [];
        let attributesToUpdate: AttributeRes[] = [];
        const foundAttributes = await findAttributes(apiKey, datasourceId);

        if (!foundAttributes.length) {
          attributesToAdd = productData.attributes;
        } else {
          try {
            attributesToAdd = productData.attributes.filter(
              (x) => !foundAttributes.find((y) => y.attributeId === x.id)
            );
            attributesToUpdate = productData.attributes.filter((x) =>
              foundAttributes.find((y) => y.attributeId === x.id)
            );
          } catch (err) {
            console.log(err);
            debugger;
          }
        }
        for (const attributeToAdd of attributesToAdd) {
          // Check if the attribute already exists
          let attribute = await transactionalEntityManager.findOne(Attribute, {
            where: {
              attributeId: attributeToAdd.id,
            },
          });

          // If not, create a new one
          if (!attribute) {
            attribute = new Attribute();
            attribute.attributeId = attributeToAdd.id;
            attribute.name = attributeToAdd.name;
            attribute.position = attributeToAdd.position;
            attribute.visible = attributeToAdd.visible;
            attribute.variation = attributeToAdd.variation;

            attribute = await transactionalEntityManager.save(attribute);
          }

          // For each option to add, check if it already exists for this attribute
          for (const optionToAdd of attributeToAdd.options) {
            const optionValue = JSON.stringify(optionToAdd);
            let option = await transactionalEntityManager.findOne(
              AttributeOption,
              {
                where: {
                  value: optionValue,
                  attribute: attribute,
                },
              }
            );

            // If not, create a new one
            if (!option) {
              option = new AttributeOption();
              option.value = optionValue;
              option.attribute = attribute;

              await transactionalEntityManager.save(option);
            }
          }

          attributesToSave.push(attribute);
        }

        for (const attributeToUpdate of attributesToUpdate) {
          let attribute = await transactionalEntityManager.findOne(Attribute, {
            where: {
              attributeId: attributeToUpdate.id,
            },
          });
          if (attribute) {
            for (const optionToAdd of attributeToUpdate.options) {
              const optionValue = JSON.stringify(optionToAdd);
              let option = await transactionalEntityManager.findOne(
                AttributeOption,
                {
                  where: {
                    value: optionValue,
                    attribute: attribute,
                  },
                }
              );

              // If not, create a new one
              if (!option) {
                option = new AttributeOption();
                option.value = optionValue;
                option.attribute = attribute;

                await transactionalEntityManager.save(option);
              }
            }
            attributesToSave.push(attribute); // Add updated attribute to attributesToSave
          } else {
            throw new Error("Attribute doesn't exist, impossible to update");
          }
        }
        if (attributesToSave.length) product.attributes = attributesToSave;*/

        const metaDataToSave: MetaData[] = [];
        let metaDataToAdd: MetaDataRes[] = [];

        // const foundMetaData = await findMetaData(apiKey, datasourceId);
        // if (!foundMetaData.length) {
        //   metaDataToAdd = productData.meta_data;
        // } else {
        //   try {
        //     metaDataToAdd = productData.meta_data.filter(
        //       (x) => !foundMetaData.find((y) => y.metaDataId === x.id)
        //     );
        //   } catch (err) {
        //     console.log(err);
        //     debugger;
        //   }
        // }

        // for (const meta of metaDataToAdd) {
        //   const metaData = new MetaData();
        //   metaData.metaDataId = meta.id;
        //   metaData.key = meta.key;
        //   metaData.value = isJson(meta.value)
        //     ? JSON.stringify(meta.value)
        //     : meta.value;
        //   const savedMetaData = await transactionalEntityManager.save(metaData);
        //   metaDataToSave.push(savedMetaData);
        // }

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

  return data;
};

const findDimension = async (
  apiKey: string,
  datasourceId: number,
  productId: number | null,
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
          id: productId ? productId : In([0]),
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

const findAttributes = async (
  apiKey: string,
  datasourceId: number,
  productId: number
) => {
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
        productId,
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
