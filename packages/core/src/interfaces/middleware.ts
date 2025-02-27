/**
 * 中间件接口
 * 定义了中间件的标准结构
 */
export interface Middleware {
  /**
   * 中间件处理函数
   * @param ctx Koa 上下文对象
   * @param next 下一个中间件函数
   */
  use(ctx: any, next: () => Promise<void>): Promise<void>
} 