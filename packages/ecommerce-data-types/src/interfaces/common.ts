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
