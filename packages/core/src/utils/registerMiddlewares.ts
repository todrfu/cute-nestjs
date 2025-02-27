import Koa from 'koa'
import type { Constructor } from '@/interfaces/common'

/**
 * 注册单个中间件
 * @param app Koa应用实例
 * @param middlewareClass 中间件类
 * @param container 依赖注入容器
 */
export const registerMiddleware = (app: Koa, middlewareClass: Constructor, container: any) => {
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
