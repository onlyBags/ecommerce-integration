import { DGLResponse } from '@dg-live/ecommerce-data-types';
import { Shipping } from '@dg-live/ecommerce-db';
import { getBilling, getShippings } from '@dg-live/ecommerce-customer';

export class CustomerController {
  public async getCustomerShipping(
    wallet: string
  ): Promise<DGLResponse<Shipping[]>> {
    const errorFields: any = {};
    if (!wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: wallet,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new Error('Error geting customer shipping: ' + errorFields);

    try {
      const customerShippingAddress = await getShippings(wallet);
      return {
        message: 'Customer shipping addresses fetched successfully',
        status: 200,
        data: customerShippingAddress,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
  public async getCustomerBilling(
    wallet: string
  ): Promise<DGLResponse<Shipping[]>> {
    const errorFields: any = {};
    if (!wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: wallet,
      };
    }
    if (Object.keys(errorFields).length > 0) throw new Error(errorFields);

    try {
      const customerBillingAddress = await getBilling(wallet);
      return {
        message: 'Customer billing addresses fetched successfully',
        status: 200,
        data: customerBillingAddress,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
