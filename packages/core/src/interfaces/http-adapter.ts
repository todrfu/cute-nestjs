import type { Constructor } from './common'

/**
 * HTTP适配器接口
 * 定义了通用的HTTP服务抽象，使框架可以支持不同的HTTP库
 */
export interface HttpAdapter<TContext> {
  /**
   * 获取服务器实例
   */
  getInstance(): any

  /**
   * 获取上下文
   */
  getContext(): Record<string, any>

  /**
   * 注册全局中间件
   * @param handler 中间件处理函数
   */
  use(handler: any): void

  /**
   * 创建路由实例
   */
  createRouter(): any

  /**
   * 注册路由
   * @param method HTTP方法
   * @param path 路由路径
   * @param handler 路由处理函数
   */
  registerRoute(method: string, path: string, handler: (ctx: TContext) => Promise<void>): void

  /**
   * 应用路由中间件
   * @param router 路由实例
   */
  applyRouter(router: any): void

  /**
   * 获取请求参数
   * @param req 请求对象
   */
  getRequestParams(req: TContext): Record<string, string>

  /**
   * 获取查询参数
   * @param req 请求对象
   */
  getRequestQuery(req: TContext): Record<string, string | string[]>

  /**
   * 获取请求体
   * @param req 请求对象
   */
  getRequestBody(req: TContext): unknown

  /**
   * 设置响应
   * @param res 响应对象
   * @param value 响应值
   */
  setResponse(res: TContext, value: unknown): void

  /**
   * 启动HTTP服务
   * @param port 端口号
   * @param callback 回调函数
   */
  listen(port: number, callback?: () => void): void
}

/**
 * HTTP适配器工厂接口
 */
export interface HttpAdapterFactory<TContext = any> {
  /**
   * 创建HTTP适配器实例
   */
  create(): HttpAdapter<TContext>
}

/**
 * 应用选项接口
 */
export interface ApplicationOptions<TContext = any> {
  /**
   * HTTP适配器类
   */
  httpAdapter?: Constructor<HttpAdapter<TContext>>
} 