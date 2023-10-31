import {
  Controller,
  Route,
  SuccessResponse,
  Get,
  Tags,
  FieldErrors,
  ValidateError,
  Path,
} from 'tsoa';

import { DGLResponse } from '@dg-live/ecommerce-data-types';
import { Shipping } from '@dg-live/ecommerce-db';
import { getBilling, getShippings } from '@dg-live/ecommerce-customer';

@Route('customer')
@Tags('Customer')
export class CustomerController extends Controller {
  @Get('/shipping/{wallet}')
  @SuccessResponse('200', 'Shipping fetched successfully')
  public async getCustomerShipping(
    @Path() wallet: string
  ): Promise<DGLResponse<any[]>> {
    const errorFields: FieldErrors = {};
    if (!wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: wallet,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error geting customer shipping');

    try {
      const customerShippingAddress = await getShippings(wallet);
      return {
        message: 'Customer shipping addresses fetched successfully',
        status: 200,
        data: customerShippingAddress,
      };
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/billing/{wallet}')
  @SuccessResponse('200', 'Billing fetched successfully')
  public async getCustomerBilling(
    @Path() wallet: string
  ): Promise<DGLResponse<any[]>> {
    const errorFields: FieldErrors = {};
    if (!wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: wallet,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error geting customer billing');

    try {
      const customerBillingAddress = await getBilling(wallet);
      return {
        message: 'Customer billing addresses fetched successfully',
        status: 200,
        data: customerBillingAddress,
      };
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
