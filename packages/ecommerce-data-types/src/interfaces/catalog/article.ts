export interface Article {
  id: number;
  variationId?: number;
  productId: number;
  datasourceId: number;
  name: string;
  type: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  shopType: 'woocommerce' | 'magento';
  images: Image[];
  categories: Category[];
  attributes: Attribute[];
}

export interface Attribute {
  id: number;
  attributeId: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: Option[];
}

export interface Option {
  id: number;
  value: string[];
}

export interface Category {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
}

export interface Image {
  id: number;
  src: string;
  name: string;
  alt: null;
}

// export interface ArticleImage {
//   id: number;
//   imageId: number;
//   src: string;
//   name: string;
//   alt: null | string;
// }

// export interface ArticleCategory {
//   id: number;
//   categoryId: number;
//   name: string;
//   slug: string;
// }

// export interface Article {
//   id: number;
//   productId: number;
//   syncedAt: string;
//   datasourceId: number;
//   name: string;
//   slug: string;
//   permalink: string;
//   dateCreated: string;
//   dateCreatedGmt: null | string;
//   dateModified: string;
//   dateModifiedGmt: null | string;
//   type: string;
//   status: string;
//   featured: boolean;
//   catalogVisibility: string;
//   description: string;
//   shortDescription: string;
//   sku: string;
//   price: string;
//   regularPrice: string;
//   salePrice: string;
//   priceHtml: null | string;
//   onSale: boolean;
//   purchasable: boolean;
//   virtual: boolean;
//   externalUrl: string;
//   buttonText: string;
//   taxStatus: string;
//   taxClass: string;
//   manageStock: boolean;
//   stockQuantity: null | number;
//   stockStatus: string;
//   backorders: string;
//   backordersAllowed: boolean;
//   backordered: boolean;
//   soldIndividually: boolean;
//   weight: string;
//   shippingRequired: boolean;
//   shippingTaxable: boolean;
//   shippingClass: string;
//   shippingClassId: number;
//   reviewsAllowed: boolean;
//   averageRating: string;
//   ratingCount: number;
//   relatedIds: string; // It seems like this property is a JSON string in the provided data
//   upsellIds: string; // It seems like this property is a JSON string in the provided data
//   crossSellIds: string; // It seems like this property is a JSON string in the provided data
//   parentId: number;
//   purchaseNote: string;
//   defaultAttributes: null; // It seems like this property is always null in the provided data
//   variations: string; // It seems like this property is a JSON string in the provided data
//   groupedProducts: string; // It seems like this property is a JSON string in the provided data
//   menuOrder: number;
//   jetpackPublicizeConnections: null | string;
//   images: ArticleImage[];
//   categories: ArticleCategory[];
// }
