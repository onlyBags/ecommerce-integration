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

import { envConfig } from '@dg-live/ecommerce-config';
import { User, Datasource } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import {
  SaveUserReq,
  SaveUserDatasourceReq,
  DGLResponse,
} from '../interfaces/index.js';
import { createWebhooks } from '@dg-live/ecommerce-woocommerce';
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
      throw new ValidateError(fields, 'Error adding user');
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

  @Post('/user/datasource')
  @SuccessResponse('201', 'Created')
  public async saveUserDatasource(
    @Header('api-key') apiKey: string,
    @Body() requestBody: SaveUserDatasourceReq
  ): Promise<DGLResponse<Datasource>> {
    const fields: FieldErrors = {};
    const {
      platform,
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret,
      baseUrl,
    } = requestBody;
    if (!apiKey) {
      fields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }
    if (!consumerKey) {
      fields.consumerKey = {
        message: 'Invalid consumerKey',
        value: consumerKey,
      };
    }
    if (!consumerSecret) {
      fields.consumerSecret = {
        message: 'Invalid consumerSecret',
        value: consumerSecret,
      };
    }
    if (!baseUrl) {
      fields.baseUrl = {
        message: 'Invalid baseUrl',
        value: baseUrl,
      };
    }
    if (platform === 'magento') {
      if (!accessToken) {
        fields.accessToken = {
          message: 'Invalid accessToken',
          value: accessToken,
        };
      }
      if (!accessTokenSecret) {
        fields.accessTokenSecret = {
          message: 'Invalid accessTokenSecret',
          value: accessTokenSecret,
        };
      }
    }
    if (Object.keys(fields).length) {
      throw new ValidateError(fields, 'Error saving user datasource');
    }
    try {
      const resp = {
        message: 'User datasource created successfully',
        status: 201,
        data: await dashboardService.saveUserDatasource(apiKey, requestBody),
      };
      // await createWebhooks({
      //   apiKey,
      //   datasourceId: resp.data.id,
      // });
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/user/datasource')
  @SuccessResponse('200', 'User')
  public async getUserDatasources(
    @Header('api-key') apiKey: string
  ): Promise<DGLResponse<Datasource[]>> {
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
      const resp = {
        message: 'User datasources fetched successfully-55555',
        status: 200,
        data: await dashboardService.getUserDatasources(apiKey),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/user/datasource/{datasourceId}')
  @SuccessResponse('200', 'User')
  public async getUserDatasource(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number
  ): Promise<DGLResponse<Datasource>> {
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
      const resp = {
        message: 'User datasources fetched successfully',
        status: 200,
        data: await dashboardService.getUserDatasource(apiKey, datasourceId),
      };
      return resp as DGLResponse<Datasource>;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
