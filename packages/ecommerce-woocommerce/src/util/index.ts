import {
  AppDataSource,
  User,
  WoocommerceProduct,
  Category,
  Tag,
  Image,
  Attribute,
  Dimensions,
} from '@dg-live/ecommerce-db';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { WoocommerceProductRes } from '../interfaces/index.js';
const WooCommerceRest = WooCommerceRestApi.default;
const userRepository = AppDataSource.getRepository(User);

export const createNewWoocommerceInstance = async ({
  apiKey,
  datasourceId,
}): Promise<InstanceType<typeof WooCommerceRest> | null> => {
  const foundUserDatasource = await userRepository.findOne({
    relations: ['datasource'],
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
      },
    },
  });
  if (!foundUserDatasource) return null;
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

export const parseProductResponse = (
  response: WoocommerceProductRes[],
  datasourceId: number
): WoocommerceProduct[] => {
  const data: WoocommerceProduct[] = [];
  response.forEach((wocommerceProduct) => {
    const productData = wocommerceProduct;
    const product = new WoocommerceProduct();

    product.datasourceId = datasourceId;
    product.id = productData.id;
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

    const dimension = new Dimensions();
    dimension.length = productData.dimensions.length;
    dimension.width = productData.dimensions.width;
    dimension.height = productData.dimensions.height;
    product.dimensions = dimension;

    product.categories = productData.categories.map((categoryData: any) => {
      const category = new Category();
      category.id = categoryData.id;
      category.name = categoryData.name;
      category.slug = categoryData.slug;
      return category;
    });

    product.tags = productData.tags.map((tagData: any) => {
      const tag = new Tag();
      tag.id = tagData.id;
      tag.name = tagData.name;
      tag.slug = tagData.slug;
      return tag;
    });

    product.images = productData.images.map((imageData: any) => {
      const image = new Image();
      image.id = imageData.id;
      image.src = imageData.src;
      image.name = imageData.name;
      return image;
    });

    product.attributes = productData.attributes.map((attributeData: any) => {
      const attribute = new Attribute();
      attribute.id = attributeData.id;
      attribute.name = attributeData.name;
      attribute.position = attributeData.position;
      attribute.visible = attributeData.visible;
      attribute.variation = attributeData.variation;
      attribute.options = JSON.stringify(attributeData.options); // Storing array as string
      return attribute;
    });

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
  });
  return data;
};
