import {
  Controller,
  Route,
  SuccessResponse,
  ValidateError,
  FieldErrors,
  Tags,
  Body,
  Post,
} from 'tsoa';
import {
  DGLResponse,
  AuthBody,
  AuthUserData,
} from '@dg-live/ecommerce-data-types';

import { verifySignature } from '@dg-live/ecommerce-web3';
import { getBilling, getShipping } from '@dg-live/ecommerce-customer';

@Route('/auth')
@Tags('Auth')
export class AuthController extends Controller {
  @Post('/')
  @SuccessResponse('200', 'User Data')
  public async getUserData(
    @Body() body: AuthBody
  ): Promise<DGLResponse<AuthUserData>> {
    if (!body.address || !body.message || !body.signature) {
      const fields: FieldErrors = {
        body: {
          message: 'Invalid Body',
          value: body,
        },
      };
      throw new ValidateError(fields, 'Error fetching user data');
    }
    try {
      const isValid = await verifySignature(
        body.signature,
        body.message,
        body.address
      );
      if (!isValid) {
        const field: FieldErrors = {
          body: {
            message: 'Invalid signature',
          },
        };
        throw new ValidateError(field, 'Error fetching user data');
      }
      const billingAddress = await getBilling(body.address);
      const shippingAddress = await getShipping(body.address);
      const response = {
        message: 'User Data',
        status: 200,
        data: {
          billingAddress,
          shippingAddress,
        },
      };
      return response;
    } catch (err) {
      if (err instanceof ValidateError) throw err;
      throw new ValidateError({}, err.message);
    }
  }
}

