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
  Path,
} from 'tsoa';

import { DGLResponse } from '../interfaces/index.js';
import { getAllProducts } from '@dg-live/ecommerce-magento';
import { WoocommerceProduct } from '@dg-live/ecommerce-db';

@Route('magento')
@Tags('Magento')
export class MagentoController extends Controller {
  @Get('/catalog/{datasourceId}')
  @SuccessResponse('200', 'Created')
  public async getCatalog(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocommerceProduct[]>> {
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
      throw new ValidateError(errorFields, 'Error geting product catalog');

    try {
      const wProducts = await getAllProducts({
        apiKey,
        datasourceId,
      });
      const resp = {
        message: 'Products fetched successfully',
        status: 200,
        data: wProducts,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/catalog/sync/{datasourceId}')
  @SuccessResponse('200', 'Created')
  public async syncCatalog(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocommerceProduct[]>> {
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
      throw new ValidateError(errorFields, 'Error geting product catalog');

    try {
      const wProducts = await getAllProducts({
        apiKey,
        datasourceId,
      });
      const resp = {
        message: 'Catalog synced successfully',
        status: 200,
        data: wProducts,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}