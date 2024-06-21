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
  Example,
} from 'tsoa';

import { DGLResponse, SlotRes } from '@dg-live/ecommerce-data-types';
import { getAllProducts, getAllSlots } from '../services/catalog/index.js';

import * as catalogService from '../services/catalog/index.js';

@Route('catalog')
@Tags('Catalog')
export class CatalogController extends Controller {
  @Get('/{datasourceId}')
  @SuccessResponse('200', 'Created')
  public async getCatalog(
    @Path() datasourceId: number
  ): Promise<DGLResponse<any>> {
    const errorFields: FieldErrors = {};
    if (!datasourceId) {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId',
        value: datasourceId,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error geting product catalog');
    try {
      const products = await getAllProducts(+datasourceId);
      const resp = {
        message: 'Products fetched successfully',
        status: 200,
        data: products,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/sync/{datasourceId}')
  @SuccessResponse('200', 'Created')
  public async syncCatalog(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
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
        message: 'Catalog synced successfully',
        status: 200,
        data: await catalogService.syncCatalog({ apiKey, datasourceId }), //await syncCatalog({ apiKey, datasourceId }),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/slots/{datasourceId}')
  @SuccessResponse('200', 'Created')
  public async slots(
    @Path() datasourceId: number
  ): Promise<DGLResponse<SlotRes[]>> {
    const errorFields: FieldErrors = {};
    if (!datasourceId) {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId',
        value: datasourceId,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error geting product catalog');
    try {
      const slots = await getAllSlots(+datasourceId);
      const resp = {
        message: 'Slots fetched successfully',
        status: 200,
        data: slots,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  // @Get('/settings/{datasourceId}')
  // @SuccessResponse('200', 'Webhook')
  // public async getSettings(
  //   @Header('api-key') apiKey: string,
  //   @Path() datasourceId: number
  // ): Promise<DGLResponse<any>> {
  //   if (!apiKey) throw new Error('Invalid apiKey');
  //   if (!datasourceId) throw new Error('Invalid datasourceId');
  //   try {
  //     const settings = await getSettings({ apiKey, datasourceId });
  //     return {
  //       message: 'settings fetched successfully',
  //       status: 200,
  //       data: settings,
  //     };
  //   } catch (error) {
  //     throw new ValidateError(
  //       {},
  //       'Error getting webhooks: ' + error.message || ''
  //     );
  //   }
  // }
}
