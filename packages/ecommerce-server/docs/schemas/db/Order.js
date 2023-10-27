export const Order = {
  $id: 'number',
  customer: {
    $ref: '#/components/schemas/Customer',
  },
  orderId: 'number',
  status: 'string',
  currency: 'string',
  total: 'number',
  orderKey: 'string',
  iceValue: 'number',
  iceValueTimestamp: 'string',
};
