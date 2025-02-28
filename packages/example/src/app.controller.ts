import { Controller, Get, Param, Query } from '@otdrfu/cute-nestjs'
import { AppService } from './app.service'
import { UserService } from './modules/users/user.service'

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/user/:id')
  async getUser(
    @Param('id') id: number,
    @Query() query: Record<string, any>,
    @Query('id') queryId: number
  ): Promise<any> {
    const user = await this.userService.findById(id)
    return {
      ...user,
      query,
      paramId: id,
      queryId,
    }
  }
}
