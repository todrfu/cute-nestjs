import { PatchRequestContextMiddleware } from '@/middleware/patch-request-context'
import { createRoutes } from './createRoutes'
import type { HttpAdapter } from '@/interfaces/http-adapter'
import type { BootstrapOptions } from '@/interfaces/bootstrap'

/**
 * 初始化应用程序，注册控制器和路由
 * @param httpAdapter HTTP适配器实例
 * @param options 初始化选项
 */
export async function bootstrap(
  httpAdapter: HttpAdapter,
  options: BootstrapOptions
): Promise<void> {
  const { controllers, providers, container } = options

  // 注册请求上下文中间件（必须在所有路由之前）
  const patchRequestContext = new PatchRequestContextMiddleware()
  httpAdapter.use(patchRequestContext)

  // 创建路由实例
  const router = httpAdapter.createRouter()

  // 注册控制器路由
  for (const controller of controllers) {
    createRoutes(router, controller, container, providers)
  }

  // 应用路由中间件
  httpAdapter.applyRouter(router)
}
