import { Controller, Get, Post, Body, Param, BadRequestException } from '@otdrfu/cute-nestjs'
import { UserService } from './user.service'
import type { CreateUserDto } from './dto/create-user.dto'

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id)
    if (!user) {
      throw new BadRequestException('用户不存在')
    }
    return user
  }

  @Post('/')
  async createUser(@Body() data: CreateUserDto) {
    if (!data.username || !data.email) {
      throw new BadRequestException('用户名和邮箱不能为空')
    }
    return this.userService.create(data)
  }
} 