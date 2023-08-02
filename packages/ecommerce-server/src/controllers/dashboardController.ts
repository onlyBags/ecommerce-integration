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
import { User, Datasource, Slot } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import {
  SaveUserReq,
  SaveUserDatasourceReq,
  DGLResponse,
  NewSlotReq,
} from '../interfaces/index.js';
import { createWebhooks } from '@dg-live/ecommerce-woocommerce';
@Route('dashboard')
@Tags('Client')
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
        data: await dashboardService.saveClient(requestBody),
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
      wallet,
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
      if (!wallet) {
        fields.wallet = {
          message: 'Invalid wallet',
          value: wallet,
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
        message: 'User datasources fetched successfully',
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

  @Post('/user/slot')
  @SuccessResponse('201', 'Created')
  public async newSlot(
    @Header('api-key') apiKey: string,
    @Body() requestBody: NewSlotReq
  ): Promise<DGLResponse<Slot>> {
    const fields: FieldErrors = {};
    const {
      name,
      datasourceId,
      enabled,
      posX,
      posY,
      posZ,
      sizeX,
      sizeY,
      sizeZ,
      rotX,
      rotY,
      rotZ,
      productId,
    } = requestBody;
    if (!apiKey || typeof apiKey !== 'string') {
      fields.apiKey = {
        message: 'Invalid apiKey',
        value: apiKey,
      };
    }
    if (
      !name ||
      typeof name !== 'string' ||
      name.length > 255 ||
      name.length < 3
    ) {
      fields.name = {
        message:
          'Invalid name, it should be a string between 3 and 255 characters',
        value: name,
      };
    }
    if (typeof datasourceId !== 'number') {
      fields.datasourceId = {
        message: 'Invalid datasourceId, it should be a number',
        value: datasourceId,
      };
    }
    if (!Number.isFinite(posX)) {
      fields.posX = {
        message: 'Invalid posX',
        value: posX,
      };
    }
    if (!Number.isFinite(posY)) {
      fields.posY = {
        message: 'Invalid posY',
        value: posY,
      };
    }
    if (!Number.isFinite(posZ)) {
      fields.posZ = {
        message: 'Invalid posZ',
        value: posZ,
      };
    }
    if (!Number.isFinite(sizeX)) {
      fields.sizeX = {
        message: 'Invalid sizeX',
        value: sizeX,
      };
    }
    if (!Number.isFinite(sizeY)) {
      fields.sizeY = {
        message: 'Invalid sizeY',
        value: sizeY,
      };
    }
    if (!Number.isFinite(sizeZ)) {
      fields.sizeZ = {
        message: 'Invalid sizeZ',
        value: sizeZ,
      };
    }
    if (!Number.isFinite(rotX) || rotX < 0 || rotX > 360) {
      fields.rotX = {
        message: 'Invalid rotX, it should be a number between 0 and 360',
        value: rotX,
      };
    }
    if (!Number.isFinite(rotY) || rotY < 0 || rotY > 360) {
      fields.rotY = {
        message: 'Invalid rotY, it should be a number between 0 and 360',
        value: rotY,
      };
    }
    if (!Number.isFinite(rotZ) || rotZ < 0 || rotZ > 360) {
      fields.rotZ = {
        message: 'Invalid rotZ, it should be a number between 0 and 360',
        value: rotZ,
      };
    }
    if (typeof productId !== 'number') {
      fields.productId = {
        message: 'Invalid productId, it should be a number',
        value: productId,
      };
    }

    if (Object.keys(fields).length > 0) {
      throw new ValidateError(fields, 'Error creating new slot');
    }

    try {
      const resp = {
        message: 'Slot created successfully',
        status: 201,
        data: await dashboardService.saveSlot(apiKey, requestBody),
      };
      return resp;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
