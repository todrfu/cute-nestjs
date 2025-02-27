import type { Constructor } from './common'
import type { Middleware } from './middleware'

/**
 * 中间件消费者接口
 * 用于配置中间件的应用范围和路由
 */
export interface MiddlewareConsumer {
  /**
   * 应用中间件
   * @param middleware 中间件类或实例数组
   */
  apply(...middleware: (Constructor | Middleware)[]): MiddlewareConfigProxy
}

/**
 * 中间件配置代理接口
 */
export interface MiddlewareConfigProxy {
  /**
   * 指定中间件应用的路由
   * @param routes 路由路径或控制器类
   */
  forRoutes(...routes: (string | Constructor)[]): MiddlewareConsumer

  /**
   * 排除特定路由
   * @param routes 要排除的路由路径
   */
  exclude(...routes: string[]): MiddlewareConfigProxy
}

/**
 * 模块中间件接口
 */
export interface CuteNestModule {
  /**
   * 配置模块的中间件
   * @param consumer 中间件消费者
   */
  configure(consumer: MiddlewareConsumer): void | Promise<void>
} 