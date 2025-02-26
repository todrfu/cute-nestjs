import * as Koa from 'koa'
import * as Router from 'koa-router'
import { createRoutes } from './createRoutes'
import { registerMiddlewares } from './registerMiddlewares'
import { RequestContextMiddleware } from '@/middlewares/request-context.middleware'
import { MIDDLEWARE_DECORATOR_KEY } from './const'
import { getMetadata } from './metadata'
import type { BootstrapOptions, Constructor } from '@/interfaces'

export const bootstrap = (app: Koa, router: Router, options: BootstrapOptions) => {
  const { controllers, providers, container } = options

  // 注册所有控制器到容器中
  controllers.forEach(controller => {
    container.register(controller, controller)
  })

  // 注册所有Provider到容器中
  providers.forEach(provider => {
    container.register(provider, provider)
  })

  // 注册请求上下文中间件（必须在所有路由之前）
  const requestContextMiddleware = new RequestContextMiddleware(container)
  app.use(requestContextMiddleware.resolve())

  // 自动注册所有带有 @Middleware 装饰器的Provider
  providers.forEach(provider => {
    const isMiddleware = getMetadata(MIDDLEWARE_DECORATOR_KEY, provider)
    if (isMiddleware) {
      registerMiddleware(app, provider, container)
    }
  })

  // 注册所有控制器和路由
  controllers.forEach(controller => {
    createRoutes(router, controller, container)
  })
}

/**
 * 注册单个中间件
 * @param app Koa应用实例
 * @param middlewareClass 中间件类
 * @param container 依赖注入容器
 */
function registerMiddleware(app: Koa, middlewareClass: Constructor, container: any) {
  try {
    // 创建中间件实例
    const middlewareInstance = container.get(middlewareClass)
    
    // 检查中间件是否有 resolve 方法
    if (typeof middlewareInstance.resolve !== 'function') {
      console.warn(`中间件 ${middlewareClass.name} 没有实现 resolve 方法`)
      return
    }
    
    // 获取中间件处理函数并注册到应用
    const middleware = middlewareInstance.resolve()
    app.use(middleware)
    
    console.log(`已注册中间件: ${middlewareClass.name}`)
  } catch (error) {
    console.error(`注册中间件 ${middlewareClass.name} 失败:`, error)
  }
}
