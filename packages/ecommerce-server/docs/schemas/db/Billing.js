export const Billing = {
  $id: 'number',
  customer: {
    $ref: '#/components/schemas/Customer',
  },
  firstName: 'string',
  lastName: 'string',
  address1: 'string',
  address2: {
    type: 'string',
    nullable: true,
  },
  city: 'string',
  state: 'string',
  postcode: 'string',
  country: 'string',
  email: {
    type: 'string',
    nullable: true,
  },
  phone: {
    type: 'string',
    nullable: true,
  },
};
