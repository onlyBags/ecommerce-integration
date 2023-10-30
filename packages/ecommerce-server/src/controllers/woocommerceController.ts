import {
  DGLResponse,
  WoocommerceShippingZone,
  ProductVariation,
  WoocommerceOrderCreatedRes,
  WoocommerceOrder,
  WoocommerceWebhookResponse,
  FieldErrors,
  ValidateError,
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
} from '@dg-live/ecommerce-woocommerce';

import { WoocommerceProduct } from '@dg-live/ecommerce-db';

export class WoocommerceController {
  public async getCatalog(
    apiKey: string,
    datasourceId: number
  ): Promise<DGLResponse<WoocommerceProduct[]>> {
    const errorFields: FieldErrors = {};

    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }

    if (typeof datasourceId !== 'number') {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId, it should be a number',
        value: datasourceId,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error getting product catalog');
    }

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

  public async syncCatalog(
    apiKey: string,
    datasourceId: number
  ): Promise<DGLResponse<any>> {
    const errorFields: FieldErrors = {};

    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }

    if (typeof datasourceId !== 'number') {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId, it should be a number',
        value: datasourceId,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error syncing product catalog');
    }

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

  public async getShippings(
    apiKey: string,
    datasourceId: number
  ): Promise<DGLResponse<WoocommerceShippingZone[]>> {
    const errorFields: FieldErrors = {};

    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }

    if (typeof datasourceId !== 'number') {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId, it should be a number',
        value: datasourceId,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error getting shipping zones');
    }

    try {
      const wZones = await getShippingZones({
        apiKey,
        datasourceId,
      });
      const resp = {
        message: 'Shipping Zones fetched successfully',
        status: 200,
        data: wZones,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  public async getShippingLocations(
    apiKey: string,
    datasourceId: number,
    shippingZoneId: number
  ): Promise<DGLResponse<WoocommerceShippingZone[]>> {
    const errorFields: FieldErrors = {};

    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }

    if (
      typeof datasourceId !== 'number' ||
      typeof shippingZoneId !== 'number'
    ) {
      errorFields.datasourceId = {
        message:
          'Invalid datasourceId or shippingZoneId, they should be numbers',
        value: datasourceId,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error getting shipping locations');
    }

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
  public async getShippingMethods(
    apiKey: string,
    datasourceId: number,
    shippingZoneId: number
  ): Promise<DGLResponse<WoocommerceShippingZone[]>> {
    const errorFields: FieldErrors = {};

    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }

    if (
      typeof datasourceId !== 'number' ||
      typeof shippingZoneId !== 'number'
    ) {
      errorFields.datasourceId = {
        message:
          'Invalid datasourceId or shippingZoneId, they should be numbers',
        value: datasourceId,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error getting shipping methods');
    }

    try {
      const methods = await shippingMethods({
        apiKey,
        datasourceId,
        shippingZoneId,
      });
      const resp = {
        message: 'Shipping Methods fetched successfully',
        status: 200,
        data: methods,
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  public async getProductVariation(
    apiKey: string,
    productId: number,
    datasourceId: number,
    attributes: string[],
    values: string[]
  ): Promise<DGLResponse<ProductVariation | false>> {
    const errorFields: FieldErrors = {};

    if (!apiKey) {
      errorFields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }

    if (typeof productId !== 'number' || typeof datasourceId !== 'number') {
      errorFields.id = {
        message: 'Invalid product id or datasourceId, they should be numbers',
        value: productId,
      };
    }

    if (attributes.length !== values.length) {
      errorFields.attributesVariations = {
        message: 'Attributes and values must be equal length',
        value: `attributes: ${attributes.length} | values: ${values.length}`,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error getting product variation');
    }

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

  //   @Post('/order')
  //   @SuccessResponse('200', 'Order Created')
  //   @Example<OrderExample>(
  //  {
  //   datasourceId: 1,
  //   wcOrder: {
  //     paymentMethod: 'bacs',
  //     paymentMethodTitle: 'Testing DGL-E',
  //     setPaid: false,
  //     wallet: '0x355A93EE3781CCF6084C86DAD7921e5e731ad519',
  //     billing: {
  //       firstName: 'Maiki',
  //       lastName: 'Prueba',
  //       address1: 'E. Costa',
  //       address2: '1068',
  //       city: 'Buenos Aires',
  //       state: 'BSAS',
  //       postcode: '1068',
  //       country: 'AR',
  //     },
  //     shipping: {
  //       firstName: 'Maiki',
  //       lastName: 'Prueba',
  //       address1: 'E. Costa',
  //       address2: '1068',
  //       city: 'Buenos Aires',
  //       state: 'BSAS',
  //       postcode: '1068',
  //       country: 'AR',
  //     },
  //     lineItems: [
  //       {
  //         productId: 4518,
  //         quantity: 1,
  //       },
  //     ],
  //     shippingLines: [
  //       {
  //         methodId: 'oca_wanderlust',
  //         methodTitle: 'Oca',
  //         // total: "10.00"
  //       },
  //     ],
  //   },
  // }
  // )
  public async wcCreateOrder(body: {
    datasourceId: number;
    wcOrder: WoocommerceOrder;
  }): Promise<DGLResponse<WoocommerceOrderCreatedRes>> {
    const errorFields: FieldErrors = {};

    if (typeof body.datasourceId !== 'number') {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId, it should be a number',
        value: body.datasourceId,
      };
    }

    if (!body.wcOrder?.wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: body.wcOrder.wallet,
      };
    }

    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, 'Error creating order');
    }

    try {
      const wcOrderRes = await createOrder({
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

  public async getWebhooks(
    apiKey: string,
    datasourceId: number
  ): Promise<DGLResponse<WoocommerceWebhookResponse[]>> {
    if (!apiKey) {
      throw new Error('Invalid apiKey');
    }

    if (typeof datasourceId !== 'number') {
      throw new Error('Invalid datasourceId, it should be a number');
    }

    try {
      const webhooks = await getWebhooks({ apiKey, datasourceId });
      const resp = {
        message: 'Webhooks fetched successfully',
        status: 200,
        data: webhooks,
      };
      return resp;
    } catch (err) {
      throw new ValidateError(
        {},
        'Error getting webhooks: ' + err.message || ''
      );
    }
  }

  public async createWebhooks(
    apiKey: string,
    datasourceId: number
  ): Promise<DGLResponse<WoocommerceWebhookResponse[]>> {
    if (!apiKey) {
      throw new Error('Invalid apiKey');
    }

    if (typeof datasourceId !== 'number') {
      throw new Error('Invalid datasourceId, it should be a number');
    }

    try {
      const webhooks = await createWebhooks({ apiKey, datasourceId });
      const resp = {
        message: 'Webhooks created successfully',
        status: 200,
        data: webhooks,
      };
      return resp;
    } catch (err) {
      throw new ValidateError(
        {},
        'Error getting webhooks: ' + err.message || ''
      );
    }
  }
}
