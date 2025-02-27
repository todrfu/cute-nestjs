import { Controller, Get, Param } from '@otdrfu/cute-nestjs'
import { AppService } from './app.service'
import { UserService } from './modules/users/user.service'
import type { User } from './modules/users/interfaces/user.interface'

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/user/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id)
  }
} 