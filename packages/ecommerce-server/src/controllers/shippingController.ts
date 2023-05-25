import {
  Controller,
  Route,
  SuccessResponse,
  Get,
  Tags,
  FieldErrors,
  ValidateError,
  Header,
  Path,
} from 'tsoa';

import { DGLResponse } from '../interfaces/index.js';
import {
  WoocommerceProductRes,
  getShippingZones,
} from '@dg-live/ecommerce-woocommerce';

@Route('shipping')
@Tags('Shipping')
export class ShippingController extends Controller {
  @Get('/{datasourceId}')
  @SuccessResponse('200', 'Fetch Shipping Methods')
  public async getShippings(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocommerceProductRes[]>> {
    const errorFields: FieldErrors = {};
    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }
    if (!datasourceId) {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId',
        value: datasourceId,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error geting shipping zones');

    try {
      const wProducts = await getShippingZones({
        apiKey,
        datasourceId,
      });
      const resp = {
        message: 'Shipping Zones fetched successfully',
        status: 200,
        data: wProducts,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
