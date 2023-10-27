export const OrderLog = {
  $id: 'number',
  transactionHash: 'string',
  blockNumber: 'number',
  orderStatus: 'string',
  customer: {
    $ref: '#/components/schemas/Customer',
  },
  user: {
    $ref: '#/components/schemas/User',
  },
  tokenId: 'string',
  amount: 'number',
  isValidated: 'boolean',
  createdAt: 'string',
};
