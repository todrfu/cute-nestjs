import type { HttpAdapter } from '@/interfaces/http-adapter'
import type { Constructor } from '@/interfaces/common'
import type { Middleware } from '@/interfaces/middleware'
import type { MiddlewareConsumer, MiddlewareConfigProxy } from '@/interfaces/middleware'
import { getMetadata } from '@/utils/metadata'
import {
  CONTROLLER_DECORATOR_KEY,
  GET_DECORATOR_KEY,
  POST_DECORATOR_KEY,
  PUT_DECORATOR_KEY,
  DELETE_DECORATOR_KEY,
  PATCH_DECORATOR_KEY,
} from '@/utils/const'

/**
 * 控制器路由信息接口
 */
interface ControllerRouteInfo {
  /** 控制器路由前缀 */
  prefix: string
  /** 控制器下所有方法的路由路径列表（用于精确匹配，可选） */
  routes: string[]
}

/**
 * 中间件构建器
 * 实现中间件的配置和应用
 */

export class MiddlewareBuilder<TContext> implements MiddlewareConsumer<TContext> {
  private readonly middlewareMap = new Map<
    string | Constructor,
    { middleware: Constructor | Middleware<TContext>; exclude: string[] }[]
  >()

  /** 控制器路由信息缓存，避免重复计算 */
  private readonly controllerRouteCache = new Map<Constructor, ControllerRouteInfo>()

  constructor(private readonly httpAdapter: HttpAdapter<TContext>) {}

  /**
   * 应用中间件
   */
  apply(...middleware: (Constructor | Middleware<TContext>)[]): MiddlewareConfigProxy<TContext> {
    // 记录当前配置的路由和中间件，用于 exclude 方法
    let currentRoutes: (string | Constructor)[] = []
    const currentMiddleware = middleware

    const configProxy: MiddlewareConfigProxy<TContext> = {
      forRoutes: (...routes: (string | Constructor)[]) => {
        // 更新当前配置的路由
        currentRoutes = routes
        routes.forEach(route => {
          if (!this.middlewareMap.has(route)) {
            this.middlewareMap.set(route, [])
          }
          middleware.forEach(m => {
            this.middlewareMap.get(route)!.push({ middleware: m, exclude: [] })
          })
        })
        return this
      },
      /**
       * 排除路由
       * @param excludeRoutes 需要排除的路由
       */
      exclude: (...excludeRoutes: string[]) => {
        // 为当前配置的所有路由和所有中间件添加排除规则
        currentRoutes.forEach(route => {
          const middlewareConfigs = this.middlewareMap.get(route)
          if (middlewareConfigs) {
            // 只更新当前配置的中间件（通过索引范围判断）
            const startIndex = middlewareConfigs.length - currentMiddleware.length
            for (let i = startIndex; i < middlewareConfigs.length; i++) {
              middlewareConfigs[i].exclude.push(...excludeRoutes)
            }
          }
        })
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
          // 创建一个新的中间件函数，它会检查请求路径是否匹配路由和排除规则
          const wrappedHandler = async (ctx: any, next: () => Promise<void>) => {
            const requestPath = ctx.path || ctx.url || ctx.request?.url || ''

            // 检查路由匹配
            if (!this.isRouteMatched(route, requestPath)) {
              return next() // 路由不匹配，跳过中间件
            }

            // 检查是否被排除
            if (exclude.some(pattern => this.matchPath(requestPath, pattern))) {
              return next() // 在排除列表中，跳过中间件
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
   * 检查请求路径是否匹配路由配置
   * @param route 路由配置（字符串路径、通配符 '*' 或控制器类）
   * @param requestPath 请求路径
   * @returns 是否匹配
   */
  private isRouteMatched(route: string | Constructor, requestPath: string): boolean {
    // 如果是通配符 '*'，匹配所有路由
    if (route === '*') {
      return true
    }

    // 如果是字符串路径，使用路径匹配
    if (typeof route === 'string') {
      return this.matchPath(requestPath, route)
    }

    // 如果是控制器类，获取控制器的路由信息并进行匹配
    return this.isControllerRouteMatched(route, requestPath)
  }

  /**
   * 检查请求路径是否匹配控制器路由
   * @param controller 控制器类
   * @param requestPath 请求路径
   * @returns 是否匹配
   */
  private isControllerRouteMatched(controller: Constructor, requestPath: string): boolean {
    const routeInfo = this.getControllerRouteInfo(controller)
    
    // 如果没有路由前缀，匹配所有路由（向后兼容，支持没有 @Controller 装饰器的类）
    if (!routeInfo.prefix) {
      return true
    }

    // 使用控制器的路由前缀进行匹配
    // 例如：控制器前缀为 '/app'，则匹配 '/app'、'/app/hello'、'/app/user/123' 等
    return this.matchPath(requestPath, routeInfo.prefix)
  }

  /**
   * 获取控制器的路由信息（带缓存）
   * @param controller 控制器类
   * @returns 控制器路由信息
   */
  private getControllerRouteInfo(controller: Constructor): ControllerRouteInfo {
    // 检查缓存
    if (this.controllerRouteCache.has(controller)) {
      return this.controllerRouteCache.get(controller)!
    }

    // 获取控制器路由前缀
    const controllerMetadata = getMetadata(CONTROLLER_DECORATOR_KEY, controller) || {}
    const prefix = controllerMetadata.path || ''

    // 获取所有 HTTP 方法装饰器的路由信息
    const methodDecorators = [
      GET_DECORATOR_KEY,
      POST_DECORATOR_KEY,
      PUT_DECORATOR_KEY,
      DELETE_DECORATOR_KEY,
      PATCH_DECORATOR_KEY,
    ]

    // 收集所有方法的路由路径
    const routes: string[] = []
    methodDecorators.forEach(decoratorKey => {
      const methodRoutes = getMetadata(decoratorKey, controller.prototype) || []
      methodRoutes.forEach(({ path }: { path: string }) => {
        // 组合完整路径：控制器前缀 + 方法路径
        const fullPath = `${prefix}${path === '/' ? '' : path}`
        if (fullPath) {
          routes.push(fullPath)
        }
      })
    })

    const routeInfo: ControllerRouteInfo = {
      prefix,
      routes,
    }

    // 缓存结果
    this.controllerRouteCache.set(controller, routeInfo)

    return routeInfo
  }

  /**
   * 检查路径是否匹配模式
   * @param path 请求路径（如 '/users/123'）
   * @param pattern 路由模式（如 'users' 或 'users/*'）
   * @returns 是否匹配
   */
  private matchPath(path: string, pattern: string): boolean {
    // 规范化路径，确保以 / 开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`

    // 如果模式以 /* 结尾，表示匹配该路径下的所有子路径，但不匹配路径本身
    if (normalizedPattern.endsWith('/*')) {
      const prefix = normalizedPattern.slice(0, -2) // 移除 '/*'
      return normalizedPath.startsWith(`${prefix}/`)
    }

    // 如果模式包含 *，使用正则表达式匹配
    if (normalizedPattern.includes('*')) {
      const regexPattern = normalizedPattern
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/')
      return new RegExp(`^${regexPattern}$`).test(normalizedPath)
    }

    // 普通路径匹配：精确匹配或作为前缀匹配
    // 例如 'users' 匹配 '/users' 和 '/users/123'，但不匹配 '/userservice'
    return normalizedPath === normalizedPattern || 
           normalizedPath.startsWith(`${normalizedPattern}/`)
  }
} 