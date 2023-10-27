export const Shipping = {
  $id: 'number',
  customer: {
    $ref: '#/components/schemas/Customer',
  },
  firstName: 'string',
  lastName: 'string',
  address1: 'string',
  address2: 'string?',
  city: 'string',
  state: 'string',
  postcode: 'string',
  country: 'string',
};
