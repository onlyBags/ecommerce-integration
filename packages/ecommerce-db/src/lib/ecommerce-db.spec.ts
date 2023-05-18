import { ecommerceDb } from './ecommerce-db';

describe('ecommerceDb', () => {
  it('should work', () => {
    expect(ecommerceDb()).toEqual('ecommerce-db');
  });
});
