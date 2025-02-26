import { Middleware } from '@/decorators/middleware'
import { REQUEST_CONTEXT_ID } from '@/utils/const'
import type { Container } from '@/interfaces'
import type { Context, Next } from 'koa'

/**
 * 请求上下文中间件
 * 为每个请求创建唯一的上下文ID，并在请求结束时清理请求作用域的实例
 */
@Middleware()
export class RequestContextMiddleware {
  constructor(private readonly container: Container) {}

  resolve() {
    return async (ctx: Context, next: Next) => {
      // 为请求创建上下文ID
      const contextId = this.container.createContextId()
      
      // 将上下文ID附加到请求对象
      ctx.state[REQUEST_CONTEXT_ID] = contextId
      
      try {
        // 继续处理请求
        await next()
      } finally {
        // 请求结束后清理请求作用域的实例
        this.container.clearRequestScopedInstances(contextId)
      }
    }
  }
} 