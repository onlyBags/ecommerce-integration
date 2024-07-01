export interface OrderShipping {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
}

export interface OrderBilling extends OrderShipping {
  phone?: string;
}

export interface LineItem {
  productId: number;
  name: string;
  description?: string;
  quantity: number;
  variationId?: number;
}

export interface ShippingLine {
  methodId: string;
  methodTitle: string;
  total?: string;
}
