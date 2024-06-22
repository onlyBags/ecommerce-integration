import { Order } from '@dg-live/ecommerce-db';
import {
  LineItem,
  MetaData,
  OrderBilling,
  OrderShipping,
  ShippingLine,
} from '../index.js';

export interface OnlyBagsOrderCreatedRes {
  dgLiveOrder: Order;
  raw: WCOrderCreated | MGOrderCreated;
}

export interface OnlyBagsOrderRequest {
  paymentMethod: string;
  paymentMethodTitle: string;
  wallet: string;
  billing: OrderBilling;
  shipping: OrderShipping;
  lineItems: LineItem[];
  shippingLines: ShippingLine[];
  shippingId?: number;
  billingId?: number;
  saveBilling?: boolean;
  saveShipping?: boolean;
}

export interface WCOrderCreated {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: any;
  date_paid: string;
  cart_hash: string;
  number: string;
  tax_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: any;
  date_paid_gmt: string;
  currency_symbol: string;
}

export interface MGOrderCreated {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: any;
  date_paid: string;
  cart_hash: string;
  number: string;
  tax_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: any;
  date_paid_gmt: string;
  currency_symbol: string;
}
