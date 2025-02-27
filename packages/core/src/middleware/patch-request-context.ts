import { randomUUID } from 'crypto'
import { REQUEST_CONTEXT_ID } from '@/utils/const'
import { Injectable } from '@/decorators/injectable'
import type { Middleware } from '@/interfaces/middleware'

/**
 * 请求上下文中间件
 * 用于在请求生命周期内管理上下文ID
 */
@Injectable()
export class PatchRequestContextMiddleware implements Middleware {
  constructor() {}
  /**
   * 中间件处理函数
   */
  async use(ctx: any, next: () => Promise<void>) {
    // 为每个请求创建唯一的上下文ID
    const contextId = randomUUID()
    ctx.state[REQUEST_CONTEXT_ID] = contextId

    try {
      await next()
    } finally {
      // 清理上下文ID
      delete ctx.state[REQUEST_CONTEXT_ID]
    }
  }
} 