import { Container } from '@/core/container'
import { ModuleRef } from '@/core/module-ref'
import { MiddlewareBuilder } from '@/core/middleware-builder'
import { KoaAdapter } from '@/adapters/koa-adapter'
import { bootstrap } from '@/core/bootstrap'

import { hasMetadata, getMetadata } from '@/utils/metadata'
import { INJECTABLE_DECORATOR_KEY, MODULE_METADATA_DECORATOR_KEY } from '@/utils/const'
import type { Constructor } from '@/interfaces/common'
import type { CuteNestModule } from '@/interfaces/middleware'
import type { HttpAdapter, ApplicationOptions } from '@/interfaces/http-adapter'

/**
 * 核心工厂类，负责创建和初始化应用实例
 * 注册 controller
 * 初始化 provider
 * 管理生命周期
 */
export class CuteNestFactory {
  // 全局模块
  private static globalModules = new Set<Constructor>()
  private static providers: Constructor[] = []
  private static container: Container

  /**
   * 创建应用实例
   * @param rootModule 根模块类
   * @param options 应用选项
   * @returns HTTP适配器实例
   */
  static async create<TContext>(rootModule: Constructor, options: ApplicationOptions<TContext> = {}): Promise<HttpAdapter<TContext>> {
    try {
      // 创建HTTP适配器
      const httpAdapter = (options.httpAdapter ? new options.httpAdapter() : new KoaAdapter()) as HttpAdapter<TContext>
      const container = new Container()
      this.container = container
      const moduleRef = new ModuleRef(container)

      // 验证根模块是否有效
      if (!hasMetadata(MODULE_METADATA_DECORATOR_KEY, rootModule)) {
        throw new Error(`${rootModule.name} 不是一个合法模块，该模块是否使用了 @Module() ?`)
      }

      // 获取根模块的元数据
      const metadata = getMetadata(MODULE_METADATA_DECORATOR_KEY, rootModule) || {}
      const { controllers = [], providers = [], imports = [] } = metadata

      // 处理导入的模块
      for (const importedModule of imports) {
        if (!hasMetadata(MODULE_METADATA_DECORATOR_KEY, importedModule)) {
          throw new Error(`${importedModule.name}模块不是一个合法模块！`)
        }

        // 注册入口模块到容器中
        container.register(importedModule, importedModule)

        const importedMetadata = getMetadata(MODULE_METADATA_DECORATOR_KEY, importedModule) || {}

        // 如果是全局模块，就添加到全局模块集合中
        if (importedMetadata.global) {
          this.globalModules.add(importedModule)
        }

        // 合并controller与provider
        controllers.push(...(importedMetadata.controllers || []))
        providers.push(...(importedMetadata.providers || []))
      }

      // 处理全局模块的provider
      for (const globalModule of this.globalModules) {
        const { providers: globalProviders = [] } = getMetadata(MODULE_METADATA_DECORATOR_KEY, globalModule) || {}
        globalProviders.forEach((provider) => {
          if (!providers.includes(provider)) {
            providers.push(provider)
          }
        })
      }

      this.providers = providers

      // 注册根模块到容器中
      container.register(rootModule, rootModule)

      // 注册所有控制器到容器中（不需要 @Injectable 装饰器）
      controllers.forEach(controller => {
        container.register(controller, controller)
      })

      // 注册所有Provider到容器中（需要 @Injectable 装饰器）
      providers.forEach(provider => {
        if (hasMetadata(INJECTABLE_DECORATOR_KEY, provider)) {
          container.register(provider, provider)
        } else {
          console.warn(`警告: Provider ${provider.name} 没有使用 @Injectable() 装饰器`)
        }
      })

      // 调用模块初始化钩子
      await this.callModuleInit(providers, container)

      // 处理模块中间件
      await this.setupModuleMiddlewares(rootModule, httpAdapter, container)

      // 初始化应用
      await bootstrap<TContext>(httpAdapter, {
        controllers,
        providers,
        container,
      })

      // 将模块引用添加到上下文中
      const ctx = httpAdapter.getContext()
      ctx.moduleRef = moduleRef

      // 调用应用程序启动钩子
      await this.callBootstrap(providers, container)

      // 设置进程退出时的处理函数
      this.setupCleanup()

      return httpAdapter
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`应用初始化失败: ${error.message}`)
      }
      throw new Error('应用初始化失败: 不明错误')
    }
  }

  /**
   * 设置模块中间件
   */
  private static async setupModuleMiddlewares<TContext>(
    module: Constructor,
    httpAdapter: HttpAdapter<TContext>,
    container: Container
  ): Promise<void> {
    const moduleInstance = await container.resolve(module)

    // 检查模块是否实现了 CuteNestModule 接口
    if (this.isCuteNestModule(moduleInstance)) {
      const builder = new MiddlewareBuilder<TContext>(httpAdapter)
      await moduleInstance.configure(builder)
      await builder.build()
    }

    // 递归处理导入的模块
    const metadata = getMetadata(MODULE_METADATA_DECORATOR_KEY, module) || {}
    const imports = metadata.imports || []

    for (const importedModule of imports) {
      await this.setupModuleMiddlewares(importedModule, httpAdapter, container)
    }
  }

  /**
   * 检查是否是 CuteNestModule
   */
  private static isCuteNestModule(value: any): value is CuteNestModule<any> {
    return value && typeof value.configure === 'function'
  }

  /**
   * 模块初始化时
   */
  private static async callModuleInit(providers: Constructor[], container: Container) {
    for (const provider of providers) {
      const instance = container.get(provider)
      if (this.hasLifecycleHook(instance, 'onModuleInit')) {
        await instance.onModuleInit()
      }
    }
  }

  /**
   * 应用启动时
   */
  private static async callBootstrap(providers: Constructor[], container: Container) {
    for (const provider of providers) {
      const instance = container.get(provider)
      if (this.hasLifecycleHook(instance, 'onApplicationBootstrap')) {
        await instance.onApplicationBootstrap()
      }
    }
  }

  /**
   * 应用关闭时
   */
  private static async callBeforeShutdown() {
    if (!this.container || !this.providers) return

    for (const provider of this.providers) {
      const instance = this.container.get(provider)
      if (this.hasLifecycleHook(instance, 'beforeApplicationShutdown')) {
        await instance.beforeApplicationShutdown()
      }
    }
  }

  /**
   * 模块销毁时
   */
  private static async callModuleDestroy() {
    if (!this.container || !this.providers) return

    for (const provider of this.providers) {
      const instance = this.container.get(provider)
      if (this.hasLifecycleHook(instance, 'onModuleDestroy')) {
        await instance.onModuleDestroy()
      }
    }
  }

  /**
   * 应用关闭时的清理函数
   */
  private static setupCleanup() {
    const cleanup = async () => {
      try {
        await this.callBeforeShutdown()

        await this.callModuleDestroy()

        console.log('应用已关闭')
        process.exit(0)
      } catch (error) {
        console.error('应用关闭出错', error)
        process.exit(1)
      }
    }

    // 监听进程退出信号
    process.on('SIGTERM', cleanup)
    process.on('SIGINT', cleanup)
  }

  /**
   * 检查实例是否实现了指定的生命周期钩子
   */
  private static hasLifecycleHook(instance: any, hook: string): boolean {
    return (
      instance &&
      typeof instance[hook] === 'function' &&
      // 检查方法是否在实例或其原型链上
      instance[hook] !== Object.prototype[hook]
    )
  }
}
