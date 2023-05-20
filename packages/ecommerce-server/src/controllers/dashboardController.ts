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
} from 'tsoa';

import { envConfig } from '@dg-live/ecommerce-config';
import { User, UserKey } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import {
  SaveUserReq,
  SaveUserKeysReq,
  DGLResponse,
} from '../interfaces/index.js';
@Route('dashboard')
@Tags('User')
export class DashboardController extends Controller {
  @Post('/user')
  @SuccessResponse('201', 'Created')
  public async createUser(
    @Body() requestBody: SaveUserReq
  ): Promise<DGLResponse<User>> {
    if (envConfig.masterKey !== requestBody.masterKey) {
      const fields: FieldErrors = {
        masterKey: {
          message: 'Invalid masterKey',
          value: requestBody?.masterKey || '',
        },
      };
      throw new ValidateError(fields, 'Error generating payment link');
    }
    try {
      const resp = {
        message: 'User created successfully',
        status: 201,
        data: await dashboardService.saveUser(requestBody),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Post('/user/keys')
  @SuccessResponse('201', 'Created')
  public async saveUserKeys(
    @Body() requestBody: SaveUserKeysReq
  ): Promise<DGLResponse<UserKey>> {
    try {
      const resp = {
        message: 'User keys created successfully',
        status: 201,
        data: await dashboardService.saveUserKeys(requestBody),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/user/keys')
  @SuccessResponse('200', 'User')
  public async getUserKeys(@Query() id: string): Promise<DGLResponse<User>> {
    try {
      const resp = {
        message: 'User keys fetched successfully',
        status: 200,
        data: await dashboardService.getUserKeys(id),
      };
      return resp;
    } catch (error) {
      throw new Error('');
    }
  }
}
