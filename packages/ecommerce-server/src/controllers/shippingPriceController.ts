import {
  Controller,
  Route,
  Get,
  Header,
  SuccessResponse,
  ValidateError,
  FieldErrors,
  Tags,
  Put,
  Path,
  Body,
  Post,
  Delete,
} from 'tsoa';
import {
  DGLResponse,
  CountriesData,
  DatasourceShippingCostUpdate,
  DatasourceShippingCost,
} from '@dg-live/ecommerce-data-types';
import { countries } from '../data/countries.js';
import { ShippingCost } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';

@Route('/shipping-price')
@Tags('Shipping Price')
export class CountriesController extends Controller {
  @Get('/countries')
  @SuccessResponse('200', 'Countries Data')
  public async getAnalytics(
    @Header('api-key') apiKey: string
  ): Promise<DGLResponse<CountriesData[]>> {
    if (!apiKey) {
      const fields: FieldErrors = {
        apiKey: {
          message: 'Invalid apiKey',
          value: apiKey,
        },
      };
      throw new ValidateError(fields, 'Error fetching countries data');
    }

    try {
      const response = {
        message: 'Countries data fetched successfully',
        status: 200,
        data: countries,
      };
      return response;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Post('/{datasourceId}')
  @SuccessResponse('200', 'Country shipping price added')
  public async addShippingCost(
    @Path() datasourceId: number,
    @Header('api-key') apiKey: string,
    @Body() body: DatasourceShippingCost
  ): Promise<DGLResponse<ShippingCost>> {
    try {
      if (!apiKey || !datasourceId) {
        const fields: FieldErrors = {
          apiKey: {
            message: 'Invalid apiKey',
            value: apiKey,
          },
          datasourceId: {
            message: 'Invalid datasourceId',
            value: datasourceId,
          },
        };
        throw new ValidateError(fields, 'Error adding shipping cost');
      }
      const resp = await dashboardService.addShippingCost({
        apiKey,
        datasourceId,
        body,
      });
      return {
        message: 'Shipping cost added successfully',
        status: 200,
        data: resp,
      };
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Put('/{datasourceId}/{countryCode}')
  @SuccessResponse('200', 'Country shipping price updated')
  public async updateShippingCost(
    @Path() datasourceId: number,
    @Path() countryCode: string,
    @Header('api-key') apiKey: string,
    @Body() body: DatasourceShippingCostUpdate
  ): Promise<DGLResponse<ShippingCost>> {
    try {
      if (!apiKey || !datasourceId) {
        const fields: FieldErrors = {
          apiKey: {
            message: 'Invalid apiKey',
            value: apiKey,
          },
          datasourceId: {
            message: 'Invalid datasourceId',
            value: datasourceId,
          },
        };
        throw new ValidateError(fields, 'Error adding shipping cost');
      }
      const resp = await dashboardService.updateShippingCost({
        apiKey,
        datasourceId,
        code: countryCode,
        body,
      });
      return {
        message: 'Shipping cost updated successfully',
        status: 200,
        data: resp,
      };
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Delete('/{datasourceId}/{countryCode}')
  @SuccessResponse('204', 'Country shipping deleted')
  public async deleteShipping(
    @Header('api-key') apiKey: string,
    @Path() datasourceId: number,
    @Path() countryCode: string
  ) {
    try {
      if (!apiKey || !datasourceId) {
        const fields: FieldErrors = {
          apiKey: {
            message: 'Invalid apiKey',
            value: apiKey,
          },
          datasourceId: {
            message: 'Invalid datasourceId',
            value: datasourceId,
          },
        };
        throw new ValidateError(fields, 'Error deleting shipping');
      }
      await dashboardService.deleteShipping({
        apiKey,
        datasourceId,
        code: countryCode,
      });
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }

  @Get('/{datasourceId}')
  @SuccessResponse('200', 'Shipping costs fetched')
  public async getShippingsByDatasourceId(@Path() datasourceId: number) {
    try {
      if (!datasourceId) {
        const fields: FieldErrors = {
          datasourceId: {
            message: 'Invalid datasourceId',
            value: datasourceId,
          },
        };
        throw new ValidateError(fields, 'Error fetching shippings costs');
      }
      const resp = await dashboardService.getShippingsByDatasourceId({
        datasourceId,
      });
      return {
        message: 'Shipping costs fetched successfully',
        status: 200,
        data: resp,
      };
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
