export const Datasource = {
  $id: 'number',
  $name: 'string',
  $wallet: 'string',
  user: {
    $ref: '#/components/schemas/User',
  },
  woocommerceProduct: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/WoocommerceProduct',
    },
  },
  slot: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Slot',
    },
  },
  $platform: {
    type: 'string',
    enum: ['woocommerce', 'magento'],
  },
  $baseUrl: 'string',
  $consumerKey: 'string',
  $consumerSecret: 'string',
  accessToken: {
    type: 'string',
    nullable: true,
  },
  accessTokenSecret: {
    type: 'string',
    nullable: true,
  },
  $webhookSecret: 'string',
  $isActive: 'boolean',
  createdAt: 'string',
  updatedAt: 'string',
};
