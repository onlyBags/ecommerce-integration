import {
  Controller,
  Route,
  SuccessResponse,
  ValidateError,
  FieldErrors,
  Tags,
  Body,
  Post,
  Example,
  Header,
} from 'tsoa';

import {
  DGLResponse,
  AuthBody,
  AuthUserData,
  OnlyBagsOrderRequest,
  OnlyBagsOrderCreatedRes,
} from '@dg-live/ecommerce-data-types';

import { verifySignature } from '@dg-live/ecommerce-web3';
import { getBilling, getShipping } from '@dg-live/ecommerce-customer';
import { createOrder } from '../services/order/index.js';

type OrderExample = {
  datasourceId: number;
  orderData: OnlyBagsOrderRequest;
};

@Route('/order')
@Tags('Order')
export class OrderController extends Controller {
  @Post('/')
  @SuccessResponse('200', 'Order Created')
  @Example<OrderExample>({
    datasourceId: 1,
    orderData: {
      paymentMethod: 'bacs',
      paymentMethodTitle: 'Testing DGL-E',
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
  public async onlyBagsCreateOrder(
    @Body()
    body: {
      datasourceId: number;
      orderData: OnlyBagsOrderRequest;
    }
  ): Promise<DGLResponse<OnlyBagsOrderCreatedRes>> {
    const errorFields: FieldErrors = {};
    if (!body.datasourceId) {
      errorFields.datasourceId = {
        message: 'Invalid datasourceId',
        value: body.datasourceId,
      };
    }
    if (!body.orderData.wallet) {
      errorFields.wallet = {
        message: 'Invalid wallet',
        value: body.orderData.wallet,
      };
    }

    if (Object.keys(errorFields).length > 0)
      throw new ValidateError(errorFields, 'Error creating order');
    try {
      const onlyBagsCreateOrder = await createOrder(
        body.datasourceId,
        body.orderData
      );
      const resp = {
        message: 'Order created successfully',
        status: 200,
        data: onlyBagsCreateOrder,
      };
      return resp as any;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
// {
//   "message": "Logins",
//   "address": "0xdaC8d078646f1a0Edf3dc700e044fA57eF17b928",
//   "signature": "0xfb1b50e6bc78f6d6acf42a54304f8824e07796c2723beeac3f17c7d02d304a1110d6b32d819da8714e5514d11cb791e52d710b7014c7efebb24a78b0433c30471b"
// }
