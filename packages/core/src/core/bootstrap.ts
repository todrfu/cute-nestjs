import { createRoutes } from '@/core/create-routes'
import type { HttpAdapter } from '@/interfaces/http-adapter'
import type { BootstrapOptions } from '@/interfaces/bootstrap'

/**
 * 初始化应用程序，注册控制器和路由
 * @param httpAdapter HTTP适配器实例
 * @param options 初始化选项
 */
export async function bootstrap<TContext>(
  httpAdapter: HttpAdapter<TContext>,
  options: BootstrapOptions
): Promise<void> {
  const { controllers, providers, container } = options

  // 创建路由实例
  const router = httpAdapter.createRouter()

  // 注册控制器路由
  for (const controller of controllers) {
    createRoutes<TContext>({
      router,
      controller,
      container,
      providers,
      httpAdapter
    })
  }

  // 应用路由中间件
  httpAdapter.applyRouter(router)
}
