import { Controller, Get, Injectable } from '@otdrfu/cute-nestjs'
import { AppService } from './app.service'

@Injectable()
@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }
} 