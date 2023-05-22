export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Image {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface Attribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface MetaDaum {
  id: number;
  key: string;
  value: any;
}

export interface Links {
  self: Self[];
  collection: Collection[];
}

export interface Self {
  href: string;
}

export interface Collection {
  href: string;
}

export interface WoocomerceProduct {
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
  dimensions: Dimensions;
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
  categories: Category[];
  tags: Tag[];
  images: Image[];
  attributes: Attribute[];
  default_attributes: any[];
  variations: number[];
  grouped_products: any[];
  menu_order: number;
  meta_data: MetaDaum[];
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
