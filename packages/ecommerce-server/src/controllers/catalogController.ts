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

import { getAllProducts, syncCatalog } from '@dg-live/ecommerce-woocommerce';
import { User, Datasource } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import { DGLResponse } from '../interfaces/index.js';

@Route('catalog')
@Tags('Catalog')
export class ProductsController extends Controller {
  @Get('/')
  @SuccessResponse('200', 'Created')
  public async getCatalog(
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
        data: await getAllProducts({ apiKey, datasourceId }),
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
