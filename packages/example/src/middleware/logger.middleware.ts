import { Injectable } from '@otdrfu/cute-nestjs'
import type { Middleware } from '@otdrfu/cute-nestjs'

@Injectable()
export class LoggerMiddleware implements Middleware {
  async use(ctx: any, next: () => Promise<void>) {
    const start = Date.now()
    console.log(`🚀 开始处理请求: ${ctx.method} ${ctx.url}`)
    
    try {
      await next()
    } finally {
      const ms = Date.now() - start
      console.log(`✨ 请求处理完成: ${ctx.method} ${ctx.url}，耗时 ${ms}ms`)
    }
  }
} 