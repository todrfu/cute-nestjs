import type { Constructor } from './common'

/**
 * 中间件接口
 * 定义了中间件的标准结构
 */
export interface Middleware<TContext> {
  /**
   * 中间件处理函数
   * @param ctx 请求上下文对象
   * @param next 下一个中间件函数
   */
  use(ctx: TContext, next: () => Promise<void>): Promise<void>
}


/**
 * 中间件消费者接口
 * 用于配置中间件的应用范围和路由
 */
export interface MiddlewareConsumer<TContext> {
  /**
   * 应用中间件
   * @param middleware 中间件类或实例数组
   */
  apply(...middleware: (Constructor<Middleware<TContext>> | Middleware<TContext>)[]): MiddlewareConfigProxy<TContext>
}

/**
 * 中间件配置代理接口
 */
export interface MiddlewareConfigProxy<TContext> {
  /**
   * 指定中间件应用的路由
   * @param routes 路由路径或控制器类
   */
  forRoutes(...routes: (string | Constructor)[]): MiddlewareConsumer<TContext>

  /**
   * 排除特定路由
   * @param routes 要排除的路由路径
   */
  exclude(...routes: string[]): MiddlewareConfigProxy<TContext>
}

/**
 * 模块中间件接口
 */
export interface CuteNestModule<TContext> {
  /**
   * 配置模块的中间件
   * @param consumer 中间件消费者
   */
  configure(consumer: MiddlewareConsumer<TContext>): void | Promise<void>
} 