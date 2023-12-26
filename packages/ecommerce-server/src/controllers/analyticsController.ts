import {
  Controller,
  Route,
  Get,
  Query,
  Header,
  SuccessResponse,
  ValidateError,
  FieldErrors,
  Tags,
} from 'tsoa';
import { getAnalyticsData } from '@dg-live/ecommerce-analytics';
import { DGLResponse } from '@dg-live/ecommerce-data-types';

@Route('/analytics')
@Tags('Analytics')
export class AnalyticsController extends Controller {
  @Get('/')
  @SuccessResponse('200', 'Analytics Data')
  public async getAnalytics(
    @Header('api-key') apiKey: string,
    @Query() datasourceId: number,
    @Query() startDate?: string,
    @Query() endDate?: string
  ): Promise<DGLResponse<any>> {
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
      throw new ValidateError(fields, 'Error fetching analytics data');
    }

    try {
      const analyticsData = await getAnalyticsData({
        apiKey,
        datasourceId,
        startDate,
        endDate,
      });
      const response = {
        message: 'Analytics data fetched successfully',
        status: 200,
        data: analyticsData,
      };
      return response;
    } catch (err) {
      throw new ValidateError({}, err.message);
    }
  }
}
