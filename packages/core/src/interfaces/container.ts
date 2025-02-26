import { Constructor } from './common'

/**
 * 依赖注入容器接口
 * 
 * 定义容器的核心功能，负责管理依赖的注册、获取和解析
 */
export interface Container {
  /**
   * 注册Provider到容器
   * @param token Provider的标识符，可以是字符串或构造函数
   * @param provider Provider的构造函数
   */
  register(token: string | Constructor, provider: Constructor): void
  
  /**
   * 从容器获取已注册的Provider实例
   * @param token Provider的标识符
   * @param contextId 可选的上下文ID，用于请求作用域
   * @returns Provider实例
   */
  get<T>(token: string | Constructor<T>, contextId?: string): T
  
  /**
   * 创建Provider的新实例
   * @param type Provider的构造函数
   * @returns Provider的新实例
   */
  create<T>(type: Constructor<T>): T
  
  /**
   * 异步解析Provider实例
   * @param token Provider的标识符
   * @param contextId 可选的上下文ID，用于请求作用域的Provider
   * @returns Promise 解析的Provider实例
   */
  resolve<T>(token: string | Constructor<T>, contextId?: string): Promise<T>
  
  /**
   * 为请求创建上下文ID
   * @returns 上下文ID
   */
  createContextId(): string
  
  /**
   * 清理请求作用域的实例
   * @param contextId 上下文ID
   */
  clearRequestScopedInstances(contextId: string): void
}
