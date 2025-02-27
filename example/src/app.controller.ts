import { Controller, Get } from '@otdrfu/cute-nestjs'
import { AppService } from './app.service'

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }
} 