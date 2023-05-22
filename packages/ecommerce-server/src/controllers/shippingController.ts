import {
  Controller,
  Route,
  SuccessResponse,
  Post,
  Body,
  Get,
  Query,
  Tags,
  FieldErrors,
  ValidateError,
  Header,
} from 'tsoa';

import { User, Datasource } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import { DGLResponse } from '../interfaces/index.js';
import {
  syncCatalog,
  getAllProducts,
  WoocomerceProduct,
  getShippingZones,
} from '@dg-live/ecommerce-woocommerce';

@Route('shipping')
@Tags('Shipping')
export class ShippingController extends Controller {
  @Get('/')
  @SuccessResponse('200', 'Fetch Shipping Methods')
  public async getCatalog(
    @Header() apiKey: string,
    @Query() datasourceId: string
  ): Promise<DGLResponse<WoocomerceProduct[]>> {
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
