import { Order } from '@dg-live/ecommerce-db';
import { MetaData } from '../index.js';

export interface OrderShipping {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderBilling extends OrderShipping {
  email?: string;
  phone?: string;
}

export interface LineItem {
  productId: number;
  quantity: number;
  variationId?: number;
}

export interface ShippingLine {
  methodId: string;
  methodTitle: string;
  total?: string;
}

export interface WoocommerceOrderCreatedRes {
  dgLiveOrder: Order;
  raw: WCOrderCreated;
}

export interface WoocommerceOrder {
  paymentMethod: string;
  paymentMethodTitle: string;
  setPaid: boolean;
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

export interface WoocommerceOrderReq {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: BillingReq;
  shipping: ShippingReq;
  line_items: LineItemReq[];
  shipping_lines: ShippingLineReq[];
  meta_data?: MetaData[];
}

export interface BillingReq {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingReq {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface LineItemReq {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

export interface ShippingLineReq {
  method_id: string;
  method_title: string;
  total: string;
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
