import { Module } from '@otdrfu/cute-nestjs'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {} 