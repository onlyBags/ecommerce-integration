import {
  Controller,
  Route,
  Get,
  Header,
  SuccessResponse,
  ValidateError,
  FieldErrors,
  Tags,
} from 'tsoa';
import { DGLResponse, CountriesData } from '@dg-live/ecommerce-data-types';
import { countries } from '../data/countries.js';

@Route('/countries')
@Tags('Countries Data')
export class CountriesController extends Controller {
  @Get('/')
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
}
