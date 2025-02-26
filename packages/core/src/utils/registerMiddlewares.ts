import * as Koa from 'koa'
import { getMetadata } from './metadata'
import { MIDDLEWARE_DECORATOR_KEY } from '../decorators'

const middlewareClsList: any[] = []

/**
 * 注册中间件
 * @param app 应用实例
 * @param cls 控制器类
 */
export const registerMiddlewares = (app: Koa, cls: any) => {
  const middleware = getMetadata(MIDDLEWARE_DECORATOR_KEY, cls)

  if (middleware) {
    middlewareClsList.push(cls)
  }

  middlewareClsList.forEach((Cls) => {
    app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
      const middlewareInstance = new Cls()
      return await middlewareInstance?.resolve()(ctx, next)
    })
  })
}
