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
import {
  syncCatalog,
  getAllProducts,
  WoocomerceShippingZone,
  getShippingZones,
  getProductVariation,
  ProductVariation,
} from '@dg-live/ecommerce-woocommerce';
import { WoocommerceProduct } from '@dg-live/ecommerce-db';

@Route('woocommerce')
@Tags('Woocommerce')
export class WoocommerceController extends Controller {
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
        data: await syncCatalog({ apiKey, datasourceId }),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/shipping/{datasourceId}')
  @SuccessResponse('200', 'Fetch Shipping Methods')
  public async getShippings(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocomerceShippingZone[]>> {
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
  @Get('/variation/{datasourceId}/{productId}')
  @SuccessResponse('200', 'Fetch product variation')
  public async getProductVariation(
    @Header('api-key') apiKey: string,
    @Path() productId: number,
    @Path() datasourceId: number,
    @Query() attributes: string[],
    @Query() values: string[]
  ): Promise<DGLResponse<ProductVariation | false>> {
    const errorFields: FieldErrors = {};
    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }
    if (!productId) {
      errorFields.id = {
        message: 'Invalid product id',
        value: productId,
      };
    }
    if (!datasourceId) {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId',
        value: datasourceId,
      };
    }
    if (attributes.length !== values.length) {
      errorFields.attributesVariations = {
        message: 'Attributes and values must be equal length',
        value: `attributes: ${attributes.length} | values: ${values.length}`,
      };
    }
    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error getting product variation');

    try {
      const productVariation = await getProductVariation({
        apiKey,
        datasourceId,
        productId,
        attributes,
        values,
      });
      const resp = {
        message: 'Product variant fetched successfully',
        status: 200,
        data: productVariation,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
