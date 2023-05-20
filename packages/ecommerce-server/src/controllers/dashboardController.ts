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

import { envConfig } from '@dg-live/ecommerce-config';
import { User, Datasource } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import {
  SaveUserReq,
  SaveUserDatasourceReq,
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
    @Header() apiKey: string,
    @Body() requestBody: SaveUserDatasourceReq
  ): Promise<DGLResponse<Datasource>> {
    if (!apiKey) {
      const fields: FieldErrors = {
        apiKey: {
          message: 'Invalid apiKey',
          value: apiKey,
        },
      };
      throw new ValidateError(fields, 'Error saving user keys');
    }
    try {
      const resp = {
        message: 'User keys created successfully',
        status: 201,
        data: await dashboardService.saveUserKeys(apiKey, requestBody),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/user/keys')
  @SuccessResponse('200', 'User')
  public async getUserDatasources(
    @Header() apiKey: string,
    @Query() id: string
  ): Promise<DGLResponse<User>> {
    if (!apiKey) {
      const fields: FieldErrors = {
        apiKey: {
          message: 'Invalid apiKey',
          value: apiKey,
        },
      };
      throw new ValidateError(fields, 'Error fetching user datasources');
    }
    try {
      console.log('apiKey', apiKey);
      const resp = {
        message: 'User datasources fetched successfully',
        status: 200,
        data: await dashboardService.getUserDatasources(id),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
