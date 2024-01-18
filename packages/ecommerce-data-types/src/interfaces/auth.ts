import { Billing, Shipping } from '@dg-live/ecommerce-db';

export interface AuthBody {
  signature: string;
  message: string;
  address: string;
}

export interface AuthUserData {
  billingAddress: Billing[];
  shippingAddress: Shipping[];
}
