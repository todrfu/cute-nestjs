import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import type { HttpAdapter } from '@/interfaces/http-adapter'
import type { Middleware as KoaMiddleware, DefaultState, DefaultContext, Next } from 'koa'
import type { IRouterParamContext } from 'koa-router'
import type { Middleware } from '@/interfaces/middleware'

export type KoaContext = Koa.ParameterizedContext<DefaultState, DefaultContext & IRouterParamContext>
type RouterHandler = (ctx: KoaContext) => Promise<void> | void

/**
 * Koa HTTP适配器
 * 实现了通用的HTTP服务抽象，使用Koa作为底层服务
 */
export class KoaAdapter implements HttpAdapter<KoaContext> {
  private readonly app: Koa<DefaultState, DefaultContext>

  constructor() {
    this.app = new Koa()
    // 使用bodyParser中间件解析请求体
    this.app.use(bodyParser())
  }

  /**
   * 获取Koa应用实例
   */
  getInstance(): Koa<DefaultState, DefaultContext> {
    return this.app
  }

  getContext(): Record<string, any> {
    return this.app.context
  }

  /**
   * 注册全局中间件
   */
  use(middleware: KoaMiddleware | Middleware<KoaContext>): void {
    if (typeof middleware === 'function') {
      // 如果是普通函数中间件，直接使用
      this.app.use(middleware as KoaMiddleware)
    } else if (middleware.use && typeof middleware.use === 'function') {
      // 如果是 NestMiddleware 实例，包装它的 use 方法
      this.app.use(async (ctx: KoaContext, next: Next) => {
        await middleware.use(ctx, next)
      })
    }
  }

  /**
   * 创建路由实例
   */
  createRouter(): Router<DefaultState, DefaultContext> {
    return new Router()
  }

  /**
   * 注册路由
   */
  registerRoute(method: string, path: string, handler: (ctx: KoaContext) => Promise<void>): void {
    const router = new Router<DefaultState, DefaultContext>()
    router[method.toLowerCase()](path, handler as RouterHandler)
    this.app.use(router.routes())
  }

  /**
   * 应用路由中间件
   */
  applyRouter(router: Router<DefaultState, DefaultContext>): void {
    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  /**
   * 获取请求参数
   */
  getRequestParams(ctx: KoaContext): Record<string, string> {
    return ctx.params
  }

  /**
   * 获取查询参数
   */
  getRequestQuery(ctx: KoaContext): Record<string, string | string[]> {
    return ctx.query
  }

  /**
   * 获取请求体
   */
  getRequestBody(ctx: KoaContext): unknown {
    return ctx.request.body
  }

  /**
   * 设置响应
   */
  setResponse(ctx: KoaContext, value: unknown): void {
    ctx.body = value
  }

  /**
   * 启动HTTP服务
   */
  listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback)
  }
} 