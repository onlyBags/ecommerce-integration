export const OrderShipping = {
  firstName: 'string',
  lastName: 'string',
  address1: 'string',
  address2: 'string?',
  city: 'string',
  state: 'string',
  postcode: 'string',
  country: 'string',
};
export const OrderBilling = {
  $ref: '#/components/schemas/OrderShipping',
  email: 'string?',
  phone: 'string?',
};
export const LineItem = {
  productId: 'number',
  quantity: 'number',
  variationId: 'number?',
};
export const ShippingLine = {
  methodId: 'string',
  methodTitle: 'string',
  total: 'string',
};

export const WoocommerceOrderReq = {
  wcOrder: {
    paymentMethod: 'string',
    paymentMethodTitle: 'string',
    setPaid: 'boolean',
    wallet: 'string',
    billing: {
      $ref: '#/components/schemas/OrderBilling',
    },
    shipping: {
      $ref: '#/components/schemas/OrderShipping',
    },
    lineItems: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/LineItem',
      },
    },
    shippingLines: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ShippingLine',
      },
    },
    shippingId: 'number',
    billingId: 'number',
    saveBilling: 'boolean',
    saveShipping: 'boolean',
  },
};

export const WoocommerceOrderCreatedRes = {
  dgLiveOrder: {
    $ref: '#/components/schemas/Order',
  },
  raw: {
    $ref: '#/components/schemas/WCOrderCreated',
  },
};

export const WCOrderCreated = {
  id: 'number',
  parent_id: 'number',
  status: 'string',
  currency: 'string',
  version: 'string',
  prices_include_tax: 'boolean',
  date_created: 'string',
  date_modified: 'string',
  discount_total: 'string',
  discount_tax: 'string',
  shipping_total: 'string',
  shipping_tax: 'string',
  cart_tax: 'string',
  total: 'string',
  total_tax: 'string',
  customer_id: 'number',
  order_key: 'string',
  payment_method: 'string',
  payment_method_title: 'string',
  transaction_id: 'string',
  customer_ip_address: 'string',
  customer_user_agent: 'string',
  created_via: 'string',
  customer_note: 'string',
  date_completed: 'any',
  date_paid: 'string',
  cart_hash: 'string',
  number: 'string',
  tax_lines: 'array',
  fee_lines: 'array',
  coupon_lines: 'array',
  refunds: 'array',
  payment_url: 'string',
  is_editable: 'boolean',
  needs_payment: 'boolean',
  needs_processing: 'boolean',
  date_created_gmt: 'string',
  date_modified_gmt: 'string',
  date_completed_gmt: 'any',
  date_paid_gmt: 'string',
  currency_symbol: 'string',
};
export const ImageVariation = {
  title: 'string',
  caption: 'string',
  url: 'string',
  alt: 'string',
  src: 'string',
  srcset: 'string',
  sizes: 'string',
  full_src: 'string',
  full_src_w: 'number',
  full_src_h: 'number',
  gallery_thumbnail_src: 'string',
  gallery_thumbnail_src_w: 'number',
  gallery_thumbnail_src_h: 'number',
  thumb_src: 'string',
  thumb_src_w: 'number',
  thumb_src_h: 'number',
  src_w: 'number',
  src_h: 'number',
};

export const ProductVariation = {
  backordersAllowed: 'boolean',
  dimensions: {
    $ref: '#/components/schemas/DimensionsRes',
  },
  price: 'number',
  regularPrice: 'number',
  image: {
    $ref: '#/components/schemas/ImageVariation',
  },
  imageId: 'number',
  isDownloadable: 'boolean',
  isInStock: 'boolean',
  isPurchasable: 'boolean',
  isSoldIndividually: 'string',
  isVirtual: 'boolean',
  maxQty: 'number',
  minQty: 'number',
  sku: 'string',
  variationDescription: 'string',
  id: 'number',
  isActive: 'boolean',
  isVisible: 'boolean',
  weight: 'string',
};

export const WoocommerceShippingZone = {
  id: 'number',
  name: 'string',
  order: 'number',
  _links: {
    $ref: '#/components/schemas/Links',
  },
};
export const DGLResponse_WoocommerceProducts = {
  data: [
    {
      $ref: '#/components/schemas/WoocommerceProduct',
    },
  ],
  status: 0,
  message: 'string',
};

export const DGLResponse_WoocommerceSyncCatalog = {
  data: {
    savedProducts: { $ref: '#/components/schemas/WoocommerceProduct' },
    updatedProducts: { $ref: '#/components/schemas/WoocommerceProduct' },
  },

  status: 0,
  message: 'string',
};

export const DGLResponse_WoocommerceShippingZones = {
  data: [
    {
      $ref: '#/components/schemas/WoocommerceShippingZone',
    },
  ],
  status: 0,
  message: 'string',
};

export const DGLResponse_WoocommerceProductVariation = {
  data: [
    {
      $ref: '#/components/schemas/ProductVariation',
    },
  ],
  status: 0,
  message: 'string',
};

export const DGLResponse_WoocommerceOrderCreatedRes = {
  data: {
    $ref: '#/components/schemas/WoocommerceOrderCreatedRes',
  },
  status: 0,
  message: 'string',
};
