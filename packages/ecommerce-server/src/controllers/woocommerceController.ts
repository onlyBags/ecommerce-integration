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

import {
  DGLResponse,
  WoocommerceShippingZone,
  ProductVariation,
  WoocommerceOrderCreatedRes,
  WoocommerceOrder,
  WoocommerceWebhookResponse,
} from '@dg-live/ecommerce-data-types';

import {
  syncCatalog,
  getAllProducts,
  getShippingZones,
  shippingLocations,
  getProductVariation,
  createOrder,
  shippingMethods,
  getWebhooks,
  createWebhooks,
  getSettings,
} from '@dg-live/ecommerce-woocommerce';

import { WoocommerceProduct } from '@dg-live/ecommerce-db';

type OrderExample = {
  datasourceId: number;
  wcOrder: WoocommerceOrder;
};
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
  @SuccessResponse('200', 'Fetch Shipping Zones')
  public async getShippings(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocommerceShippingZone[]>> {
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
  @Get('/shipping/{datasourceId}/locations/{shippingZoneId}')
  @SuccessResponse('200', 'Fetch Shipping Locations')
  public async getShippingLocations(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number,
    @Path() shippingZoneId: number
  ): Promise<DGLResponse<WoocommerceShippingZone[]>> {
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
      const locations = await shippingLocations({
        apiKey,
        datasourceId,
        shippingZoneId,
      });
      const resp = {
        message: 'Shipping Locations fetched successfully',
        status: 200,
        data: locations,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/shipping/{datasourceId}/methods/{shippingZoneId}')
  @SuccessResponse('200', 'Fetch Shipping Methods')
  public async getShippingMethods(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number,
    @Path() shippingZoneId: number
  ): Promise<DGLResponse<WoocommerceShippingZone[]>> {
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
      const locations = await shippingMethods({
        apiKey,
        datasourceId,
        shippingZoneId,
      });
      const resp = {
        message: 'Shipping Methods fetched successfully',
        status: 200,
        data: locations,
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

  @Get('/webhooks/{datasourceId}')
  @SuccessResponse('200', 'Webhook')
  public async getWebhooks(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocommerceWebhookResponse[]>> {
    if (!apiKey) throw new Error('Invalid apiKey');
    if (!datasourceId) throw new Error('Invalid datasourceId');
    try {
      const webhooks = await getWebhooks({ apiKey, datasourceId });
      return {
        message: 'Webhooks fetched successfully',
        status: 200,
        data: webhooks,
      };
    } catch (error) {
      throw new ValidateError(
        {},
        'Error getting webhooks: ' + error.message || ''
      );
    }
  }

  @Get('/settings/{datasourceId}')
  @SuccessResponse('200', 'Webhook')
  public async getSettings(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<any>> {
    if (!apiKey) throw new Error('Invalid apiKey');
    if (!datasourceId) throw new Error('Invalid datasourceId');
    try {
      const settings = await getSettings({ apiKey, datasourceId });
      return {
        message: 'settings fetched successfully',
        status: 200,
        data: settings,
      };
    } catch (error) {
      throw new ValidateError(
        {},
        'Error getting webhooks: ' + error.message || ''
      );
    }
  }

  @Post('/order')
  @SuccessResponse('200', 'Order Created')
  @Example<OrderExample>({
    datasourceId: 1,
    wcOrder: {
      paymentMethod: 'bacs',
      paymentMethodTitle: 'Testing DGL-E',
      setPaid: false,
      wallet: '0x355A93EE3781CCF6084C86DAD7921e5e731ad519',
      billing: {
        firstName: 'Maiki',
        lastName: 'Prueba',
        address1: 'E. Costa',
        address2: '1068',
        city: 'Buenos Aires',
        state: 'BSAS',
        postcode: '1068',
        country: 'AR',
      },
      shipping: {
        firstName: 'Maiki',
        lastName: 'Prueba',
        address1: 'E. Costa',
        address2: '1068',
        city: 'Buenos Aires',
        state: 'BSAS',
        postcode: '1068',
        country: 'AR',
      },
      lineItems: [
        {
          productId: 4518,
          quantity: 1,
        },
      ],
      shippingLines: [
        {
          methodId: 'oca_wanderlust',
          methodTitle: 'Oca',
          // total: "10.00"
        },
      ],
    },
  })
  public async wcCreateOrder(
    @Header('api-key') apiKey: string,
    @Body()
    body: {
      datasourceId: number;
      wcOrder: WoocommerceOrder;
    }
  ): Promise<DGLResponse<WoocommerceOrderCreatedRes>> {
    const errorFields: FieldErrors = {};
    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }
    if (!body.datasourceId) {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId',
        value: body.datasourceId,
      };
    }
    if (!body.wcOrder.wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: body.wcOrder.wallet,
      };
    }

    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error creating order');
    try {
      const wcOrderRes = await createOrder({
        apiKey,
        datasourceId: body.datasourceId,
        order: body.wcOrder,
      });
      const resp = {
        message: 'Order created successfully',
        status: 200,
        data: wcOrderRes,
      };
      return resp as any;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
  @Post('/webhooks/{datasourceId}')
  @SuccessResponse('200', 'Webhook')
  public async createWebhooks(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<WoocommerceWebhookResponse[]>> {
    if (!apiKey) throw new Error('Invalid apiKey');
    if (!datasourceId) throw new Error('Invalid datasourceId');
    try {
      const webhooks = await createWebhooks({ apiKey, datasourceId });
      return {
        message: 'Webhooks created successfully',
        status: 200,
        data: webhooks,
      };
    } catch (error) {
      throw new ValidateError(
        {},
        'Error getting webhooks: ' + error.message || ''
      );
    }
  }
}
