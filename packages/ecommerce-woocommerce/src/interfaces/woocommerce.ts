export interface DimensionsRes {
  length: string;
  width: string;
  height: string;
}

export interface CategoryRes {
  id: number;
  name: string;
  slug: string;
}

export interface TagRes {
  id: number;
  name: string;
  slug: string;
}

export interface ImageRes {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface AttributeRes {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface MetaDataRes {
  id: number;
  key: string;
  value: any;
}

export interface LinksRes {
  self: Self[];
  collection: Collection[];
}

export interface SelfRes {
  href: string;
}

export interface CollectionRes {
  href: string;
}

export interface WoocommerceProductRes {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: any;
  date_on_sale_from_gmt: any;
  date_on_sale_to: any;
  date_on_sale_to_gmt: any;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: any;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: DimensionsRes;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: any[];
  cross_sell_ids: any[];
  parent_id: number;
  purchase_note: string;
  categories: CategoryRes[];
  tags: TagRes[];
  images: ImageRes[];
  attributes: AttributeRes[];
  default_attributes: any[];
  variations: number[];
  grouped_products: any[];
  menu_order: number;
  meta_data: MetaDataRes[];
  jetpack_publicize_connections: any[];
  _links: Links;
}

export interface WoocomerceShippingZone {
  id: number;
  name: string;
  order: number;
  _links: Links;
}

export interface Links {
  self: Self[];
  collection: Collection[];
  describedby: Describedby[];
}

export interface Self {
  href: string;
}

export interface Collection {
  href: string;
}

export interface Describedby {
  href: string;
}

export interface WebhookData {
  create?: WebhookCreate[];
  delete?: number[];
}
export interface WebhookCreate {
  name: string;
  topic: string;
  delivery_url: string;
  secret: string;
}

export interface ImageVariationRes {
  title: string;
  caption: string;
  url: string;
  alt: string;
  src: string;
  srcset: string;
  sizes: string;
  full_src: string;
  full_src_w: number;
  full_src_h: number;
  gallery_thumbnail_src: string;
  gallery_thumbnail_src_w: number;
  gallery_thumbnail_src_h: number;
  thumb_src: string;
  thumb_src_w: number;
  thumb_src_h: number;
  src_w: number;
  src_h: number;
}

export interface ProductVariationRes {
  availability_html: string;
  backorders_allowed: boolean;
  dimensions: DimensionsRes;
  dimensions_html: string;
  display_price: number;
  display_regular_price: number;
  image: ImageVariationRes;
  image_id: number;
  is_downloadable: boolean;
  is_in_stock: boolean;
  is_purchasable: boolean;
  is_sold_individually: string;
  is_virtual: boolean;
  max_qty: number;
  min_qty: number;
  price_html: string;
  sku: string;
  variation_description: string;
  variation_id: number;
  variation_is_active: boolean;
  variation_is_visible: boolean;
  weight: string;
  weight_html: string;
}

export interface ImageVariation {
  title: string;
  caption: string;
  url: string;
  alt: string;
  src: string;
  srcset: string;
  sizes: string;
  full_src: string;
  full_src_w: number;
  full_src_h: number;
  gallery_thumbnail_src: string;
  gallery_thumbnail_src_w: number;
  gallery_thumbnail_src_h: number;
  thumb_src: string;
  thumb_src_w: number;
  thumb_src_h: number;
  src_w: number;
  src_h: number;
}
export interface ProductVariation {
  backordersAllowed: boolean;
  dimensions: DimensionsRes;
  price: number;
  regularPrice: number;
  image: ImageVariation;
  imageId: number;
  isDownloadable: boolean;
  isInStock: boolean;
  isPurchasable: boolean;
  isSoldIndividually: string;
  isVirtual: boolean;
  maxQty: number;
  minQty: number;
  sku: string;
  variationDescription: string;
  id: number;
  isActive: boolean;
  isVisible: boolean;
  weight: string;
}
