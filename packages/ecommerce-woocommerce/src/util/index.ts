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
import { WoocommerceProductRes } from '../interfaces/index.js';
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
  datasourceId: number,
  syncedAt: Date
): Promise<WoocommerceProduct[]> => {
  const data: WoocommerceProduct[] = [];
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
        const foundDimension = await dimensionRepository.findOne({
          where: {
            width: productData.dimensions.width,
            height: productData.dimensions.height,
            length: productData.dimensions.length,
          },
        });
        if (foundDimension) dimensionToSave = foundDimension;
        else {
          dimension.length = productData.dimensions.length || '0';
          dimension.width = productData.dimensions.width || '0';
          dimension.height = productData.dimensions.height || '0';
          dimensionToSave = await transactionalEntityManager.save(dimension);
        }
        product.dimensions = dimensionToSave;

        let categoriesToSave: Category[] = [];
        for (const categoryData of productData.categories) {
          const foundCategory = await categoryRepository.findOne({
            where: {
              categoryId: categoryData.id,
            },
          });
          if (foundCategory) categoriesToSave.push(foundCategory);
          else {
            const category = new Category();
            category.categoryId = categoryData.id;
            category.name = categoryData.name;
            category.slug = categoryData.slug;
            const savedCategory = await transactionalEntityManager.save(
              category
            );
            categoriesToSave.push(savedCategory);
          }
        }
        if (categoriesToSave.length) product.categories = categoriesToSave;

        let tagsToSave: Tag[] = [];
        for (const tagData of productData.tags) {
          const foundTag = await tagRepository.findOne({
            where: {
              tagId: tagData.id,
            },
          });
          if (foundTag) tagsToSave.push(foundTag);
          else {
            const tag = new Tag();
            tag.tagId = tagData.id;
            tag.name = tagData.name;
            tag.slug = tagData.slug;
            const savedTag = await transactionalEntityManager.save(tag);
            tagsToSave.push(savedTag);
          }
        }
        if (tagsToSave.length) product.tags = tagsToSave;

        let imagesToSave: Image[] = [];
        for (const imageData of productData.images) {
          const foundImage = await imageRepository.findOne({
            where: {
              src: imageData.src,
            },
          });
          if (foundImage) imagesToSave.push(foundImage);
          else {
            const image = new Image();
            image.imageId = imageData.id;
            image.src = imageData.src;
            image.name = imageData.name;
            const savedImage = await transactionalEntityManager.save(image);
            imagesToSave.push(savedImage);
          }
        }
        if (imagesToSave.length) product.images = imagesToSave;

        let attributesToSave: Attribute[] = [];
        for (const attributeData of productData.attributes) {
          const foundAttribute = await attributeRepository.findOne({
            where: {
              name: attributeData.name,
            },
          });
          if (foundAttribute) attributesToSave.push(foundAttribute);
          else {
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
        }
        if (attributesToSave.length) product.attributes = attributesToSave;

        const metaDataToSave: MetaData[] = [];
        for (const metaDataData of productData.meta_data) {
          const foundMetaData = await metaDataRepository.findOne({
            where: {
              key: metaDataData.key,
            },
          });
          if (foundMetaData) metaDataToSave.push(foundMetaData);
          else {
            const metaData = new MetaData();
            metaData.metaDataId = metaDataData.id;
            metaData.key = metaDataData.key;
            metaData.value = isJson(metaDataData.value)
              ? JSON.stringify(metaDataData.value)
              : metaDataData.value;
            const savedMetaDaum = await transactionalEntityManager.save(
              metaData
            );
            metaDataToSave.push(savedMetaDaum);
          }
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
        data.push(product);
      }
    );
  }
  return data;
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
