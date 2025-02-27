import { MIDDLEWARE_DECORATOR_KEY } from '@/utils/const'

/**
 * 中间件装饰器
 * 用于标记一个类为中间件
 * @example
 * ```typescript
 * @Middleware()
 * export class LoggerMiddleware implements Middleware {
 *   resolve() {
 *     return async (ctx: any, next: () => Promise<void>) => {
 *       const start = Date.now()
 *       await next()
 *       const ms = Date.now() - start
 *       console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
 *     }
 *   }
 * }
 * ```
 */
export function Middleware(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(MIDDLEWARE_DECORATOR_KEY, true, target)
  }
} 