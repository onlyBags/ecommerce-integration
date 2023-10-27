import { WoocommerceProduct } from '@dg-live/ecommerce-db/dist/entity/index.js';
import { WoocommerceProductRes } from './woocommerce.js';

export interface WCRequestOptions {
  apiKey: string;
  datasourceId: number;
}

export interface WCUpdateProduct extends WCRequestOptions {
  product: WoocommerceProductRes;
}

export interface MetaData {
  key: string;
  value: any;
}

export interface WoocommerceSyncCatalogRes {
  savedProducts?: WoocommerceProduct[];
  updatedProducts?: WoocommerceProduct[];
}
