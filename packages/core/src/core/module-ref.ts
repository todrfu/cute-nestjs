import { Container } from './container'
import { Constructor } from '../interfaces/common'

/**
 * ModuleRef 类提供了在运行时动态访问和操作依赖注入容器中的provider的能力
 * 它作为一个桥梁，让应用可以在运行时：
 * 1. 获取已注册的provider实例
 * 2. 动态创建新的provider实例
 * 3. 异步解析provider
 * 
 * 主要用于：
 * - 动态模块加载
 * - 运行时依赖注入
 * - 延迟加载服务
 * - 动态创建实例
 */
export class ModuleRef {
  constructor(private readonly container: Container) {}

  /**
   * 从容器中获取一个已注册的provider实例
   * @param typeOrToken provider的类型或令牌
   * @returns provider实例
   * 
   * 示例：
   * const userService = moduleRef.get(UserService)
   */
  get<T>(typeOrToken: Constructor<T>): T {
    return this.container.get(typeOrToken)
  }

  /**
   * 动态创建一个新的provider实例
   * 与 get 方法不同，这个方法每次调用都会创建一个新的实例
   * @param type 要创建的provider类型
   * @returns Promise<provider实例>
   * 
   * 示例：
   * const newService = await moduleRef.create(CustomService)
   */
  async create<T>(type: Constructor<T>): Promise<T> {
    return this.container.create(type)
  }

  /**
   * 异步解析一个provider实例
   * 支持处理异步依赖和上下文相关的实例
   * @param typeOrToken provider的类型或令牌
   * @param contextId 可选的上下文 ID
   * @returns Promise<provider实例>
   * 
   * 示例：
   * const service = await moduleRef.resolve(AsyncService, 'requestId')
   */
  async resolve<T>(typeOrToken: Constructor<T>, contextId?: string): Promise<T> {
    return this.container.resolve(typeOrToken, contextId)
  }
} 