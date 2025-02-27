import { Module } from '@otdrfu/cute-nestjs'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/users/user.module'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { LifecycleProvider } from './providers/lifecycle.provider'
import type { CuteNestModule, MiddlewareConsumer } from '@otdrfu/cute-nestjs'

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, LifecycleProvider]
})
export class AppModule implements CuteNestModule {
  configure(consumer: MiddlewareConsumer) {
    // 为所有路由应用日志中间件
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
} 