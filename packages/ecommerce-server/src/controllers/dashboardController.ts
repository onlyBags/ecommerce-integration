import {
  Controller,
  Route,
  SuccessResponse,
  Post,
  Body,
  Get,
  Query,
} from 'tsoa';
import { User } from '@dg-live/ecommerce-db';
import * as dashboardService from '../services/dashboard/index.js';
import { SaveUserReq } from '../interfaces/index.js';

@Route('dashboard')
export class DashboardController extends Controller {
  @Post('/user-keys')
  @SuccessResponse('201', 'Created')
  public async saveUserKeys(@Body() requestBody: SaveUserReq): Promise<User> {
    try {
      return await dashboardService.saveUserKeys(requestBody);
    } catch (error) {
      throw new Error('');
    }
  }

  @Get('/user-keys')
  @SuccessResponse('200', 'User')
  public async getUserKeys(@Query() id: number): Promise<User> {
    try {
      return await dashboardService.getUserKeys(id);
    } catch (error) {
      throw new Error('');
    }
  }
}
