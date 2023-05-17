import { Controller, Get, Route, SuccessResponse } from 'tsoa';
@Route('test')
export class UsersController extends Controller {
  @Get('')
  @SuccessResponse('200', 'OK')
  public async getTest(): Promise<string> {
    return 'Hi there! s';
  }

  @Get('/2')
  @SuccessResponse('200', 'OK')
  public async getTest2(): Promise<{ data: string }> {
    return { data: 'It Works!' };
  }
}
