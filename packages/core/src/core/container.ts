import { randomUUID } from 'crypto'
import { DESIGN_PARAMTYPES_KEY, SCOPE_OPTIONS_KEY } from '@/utils/const'
import { getMetadata } from '@/utils/metadata'
import { Scope } from '@/interfaces/scope'
import type { Constructor } from '@/interfaces/common'

/**
 * 依赖注入容器
 * 负责管理所有依赖的注册、实例化和解析
 */
export class Container {
  // 存储单例实例
  private singletonInstances = new Map<string, any>()
  // 存储请求作用域实例
  private requestScopedInstances = new Map<string, Map<string, any>>()
  // 存储类的构造函数
  private factories = new Map<string, Constructor>()
  // 存储依赖关系图，用于检测循环依赖
  private readonly dependencyGraph = new Map<string, Set<string>>()

  /**
   * 注册一个Provider到容器中
   * @param token 令牌（可以是字符串或构造函数）
   * @param provider Provider的构造函数
   */
  register(token: string | Constructor, provider: Constructor) {
    this.factories.set(this.getTokenName(token), provider)
  }

  /**
   * 获取一个Provider实例
   * @param token Provider的令牌
   * @param contextId 可选的上下文ID，用于请求作用域
   * @returns Provider实例
   */
  get<T>(token: string | Constructor<T>, contextId?: string): T {
    const tokenName = this.getTokenName(token)
    const provider = this.factories.get(tokenName)
    
    if (!provider) {
      throw new Error(`未找到Provider: ${tokenName}`)
    }

    // 获取Provider的作用域
    const scopeOptions = getMetadata(SCOPE_OPTIONS_KEY, provider) || { scope: Scope.SINGLETON }
    const scope = scopeOptions.scope

    // 根据作用域处理实例
    switch (scope) {
      case Scope.SINGLETON:
      case Scope.DEFAULT:
        return this.getSingletonInstance(provider, tokenName)
      
      case Scope.REQUEST:
        if (!contextId) {
          throw new Error(`请求作用域的Provider ${tokenName} 需要上下文ID`)
        }
        return this.getRequestScopedInstance(provider, tokenName, contextId)
      
      case Scope.TRANSIENT:
        return this.createInstance(provider)
      
      default:
        throw new Error(`不支持的作用域类型: ${scope}`)
    }
  }

  /**
   * 创建一个新的Provider实例
   * @param type Provider的构造函数
   * @returns 新的Provider实例
   */
  create<T>(type: Constructor<T>): T {
    return this.createInstance(type)
  }

  /**
   * 异步解析一个Provider实例
   * @param token Provider的令牌
   * @param contextId 可选的上下文ID
   * @returns Promise<Provider实例>
   */
  async resolve<T>(token: string | Constructor<T>, contextId?: string): Promise<T> {
    return this.get(token, contextId)
  }

  /**
   * 为请求创建上下文ID
   * @returns 上下文ID
   */
  createContextId(): string {
    return randomUUID()
  }

  /**
   * 清理请求作用域的实例
   * @param contextId 上下文ID
   */
  clearRequestScopedInstances(contextId: string): void {
    this.requestScopedInstances.delete(contextId)
  }

  /**
   * 获取令牌名称
   * @param token 令牌
   * @returns 令牌名称
   */
  private getTokenName(token: string | Constructor): string {
    return typeof token === 'string' ? token : token.name
  }

  /**
   * 获取单例实例
   * @param provider Provider构造函数
   * @param tokenName 令牌名称
   * @returns Provider实例
   */
  private getSingletonInstance<T>(provider: Constructor<T>, tokenName: string): T {
    if (!this.singletonInstances.has(tokenName)) {
      const instance = this.createInstance(provider)
      this.singletonInstances.set(tokenName, instance)
    }
    return this.singletonInstances.get(tokenName)
  }

  /**
   * 获取请求作用域的实例
   * @param provider Provider构造函数
   * @param tokenName 令牌名称
   * @param contextId 上下文ID
   * @returns Provider实例
   */
  private getRequestScopedInstance<T>(provider: Constructor<T>, tokenName: string, contextId: string): T {
    if (!this.requestScopedInstances.has(contextId)) {
      this.requestScopedInstances.set(contextId, new Map())
    }
    
    const contextInstances = this.requestScopedInstances.get(contextId)!
    
    if (!contextInstances.has(tokenName)) {
      const instance = this.createInstance(provider)
      contextInstances.set(tokenName, instance)
    }
    
    return contextInstances.get(tokenName)
  }

  /**
   * 创建Provider实例
   * @param provider Provider构造函数
   * @returns Provider实例
   */
  private createInstance<T>(provider: Constructor<T>): T {
    // 获取构造函数参数类型
    const paramTypes = getMetadata(DESIGN_PARAMTYPES_KEY, provider) || []
    
    // 解析构造函数参数
    const args = paramTypes.map((paramType: Constructor) => {
      // 处理循环依赖
      const providerTokenName = this.getTokenName(provider)
      const depParamTokenName = this.getTokenName(paramType)
      
      // 检查是否存在循环依赖
      this.checkCircularDependency(providerTokenName, depParamTokenName)
      
      // 递归解析依赖
      return this.get(paramType)
    })
    
    // 创建实例
    return new provider(...args)
  }

  /**
   * 检查循环依赖
   * @param current 当前Provider名称
   * @param dependency 依赖Provider名称
   */
  private checkCircularDependency(current: string, dependency: string): void {
    if (current === dependency) {
      throw new Error(`检测到循环依赖: ${current} 依赖自身`)
    }
    
    if (!this.dependencyGraph.has(current)) {
      this.dependencyGraph.set(current, new Set())
    }
    
    const dependencies = this.dependencyGraph.get(current)!
    dependencies.add(dependency)
    
    // 检查是否形成循环
    const visited = new Set<string>()
    const path = [current]
    
    const hasCycle = this.detectCycle(dependency, visited, path)
    if (hasCycle) {
      throw new Error(`检测到循环依赖: ${path.join(' -> ')}`)
    }
  }

  /**
   * 检测依赖图中的循环
   * @param node 当前节点
   * @param visited 已访问节点集合
   * @param path 当前路径
   * @returns 是否存在循环
   */
  private detectCycle(node: string, visited: Set<string>, path: string[]): boolean {
    if (visited.has(node)) {
      return false
    }
    
    if (path.includes(node)) {
      path.push(node)
      return true
    }
    
    visited.add(node)
    path.push(node)
    
    const dependencies = this.dependencyGraph.get(node)
    if (dependencies) {
      for (const dependency of dependencies) {
        if (this.detectCycle(dependency, visited, [...path])) {
          return true
        }
      }
    }
    
    path.pop()
    return false
  }
}