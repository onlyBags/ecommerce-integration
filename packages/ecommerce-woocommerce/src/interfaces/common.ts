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
