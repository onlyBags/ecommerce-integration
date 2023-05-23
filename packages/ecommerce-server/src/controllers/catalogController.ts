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

import { DGLResponse } from '../interfaces/index.js';
import {
  syncCatalog,
  getAllProducts,
  WoocomerceProductRes,
} from '@dg-live/ecommerce-woocommerce';

@Route('catalog')
@Tags('Catalog')
export class ProductsController extends Controller {
  @Get('/')
  @SuccessResponse('200', 'Created')
  public async getCatalog(
    @Header() apiKey: string,
    @Query() datasourceId: string
  ): Promise<DGLResponse<WoocomerceProductRes[]>> {
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

  @Get('/sync')
  @SuccessResponse('200', 'Created')
  public async syncCatalog(
    @Header() apiKey: string,
    @Query() datasourceId: string
  ): Promise<DGLResponse<any>> {
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
      const resp = {
        message: 'Products fetched successfully',
        status: 200,
        data: await syncCatalog({ apiKey, datasourceId }),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}