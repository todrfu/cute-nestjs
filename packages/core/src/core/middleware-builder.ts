import type { HttpAdapter } from '@/interfaces/http-adapter'
import type { Constructor } from '@/interfaces/common'
import type { Middleware } from '@/interfaces/middleware'
import type { MiddlewareConsumer, MiddlewareConfigProxy } from '@/interfaces/middleware'

/**
 * 中间件构建器
 * 实现中间件的配置和应用
 */
export class MiddlewareBuilder implements MiddlewareConsumer {
  private readonly middlewareMap = new Map<
    string | Constructor,
    { middleware: Constructor | Middleware; exclude: string[] }[]
  >()

  constructor(private readonly httpAdapter: HttpAdapter) {}

  /**
   * 应用中间件
   */
  apply(...middleware: (Constructor | Middleware)[]): MiddlewareConfigProxy {
    const configProxy: MiddlewareConfigProxy = {
      forRoutes: (...routes: (string | Constructor)[]) => {
        routes.forEach(route => {
          if (!this.middlewareMap.has(route)) {
            this.middlewareMap.set(route, [])
          }
          middleware.forEach(m => {
            this.middlewareMap.get(route).push({ middleware: m, exclude: [] })
          })
        })
        return this
      },
      /**
       * 排除路由
       * @param excludeRoutes 需要排除的路由
       */
      exclude: (...excludeRoutes: string[]) => {
        const lastRoute = Array.from(this.middlewareMap.keys()).pop()
        if (lastRoute) {
          const middlewareConfigs = this.middlewareMap.get(lastRoute)!
          const lastConfig = middlewareConfigs[middlewareConfigs.length - 1]
          if (lastConfig) {
            lastConfig.exclude.push(...excludeRoutes)
          }
        }
        return configProxy
      }
    }

    return configProxy
  }

  /**
   * 构建中间件
   */
  async build(): Promise<void> {
    for (const [route, configs] of this.middlewareMap) {
      for (const { middleware, exclude } of configs) {
        // 如果是类，需要实例化
        const instance = typeof middleware === 'function'
          ? new middleware()
          : middleware
        // 判断是否则原型上存在use属性
        if (Object.getPrototypeOf(instance).hasOwnProperty('use') && typeof instance.use === 'function') {
          // 创建一个新的中间件函数，它会检查请求路径是否被排除
          const wrappedHandler = async (ctx: any, next: () => Promise<void>) => {
            const requestPath = ctx.path
            if (exclude.some(pattern => this.matchPath(requestPath, pattern))) {
              return next()
            }
            return instance.use(ctx, next)
          }
          this.httpAdapter.use(wrappedHandler)
        } else {
          console.warn(`中间件 ${middleware} 没有 use 方法`)
        }
      }
    }
  }

  /**
   * 检查路径是否匹配模式
   */
  private matchPath(path: string, pattern: string): boolean {
    // 将路由模式转换为正则表达式
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/')
    return new RegExp(`^${regexPattern}$`).test(path)
  }
} 