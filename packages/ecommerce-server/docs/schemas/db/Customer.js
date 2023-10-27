export const Customer = {
  $id: 'string',
  wallet: 'string',
  orders: {
    $ref: '#/components/schemas/Order',
  },
  shipping: {
    $ref: '#/components/schemas/Shipping',
  },
  billing: {
    $ref: '#/components/schemas/Billing',
  },
  isActive: 'boolean',
  createdAt: 'string',
  updatedAt: 'string',
};
