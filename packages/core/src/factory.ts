import 'reflect-metadata'
import Koa from 'koa'
import Router from 'koa-router'
import { bootstrap } from './utils/bootstrap'
import { hasMetadata, getMetadata } from './utils/metadata'
import { Container } from './core/container'
import { ModuleRef } from './core/module-ref'
import { MODULE_METADATA_DECORATOR_KEY } from '@/utils/const'
import type { Constructor } from './interfaces/common'

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
   * @returns Koa 应用实例
   */
  static async create(rootModule: Constructor): Promise<Koa> {
    try {
      const app = new Koa()
      const router = new Router()
      const container = new Container()
      this.container = container
      const moduleRef = new ModuleRef(container)

      // 验证根模块是否有效
      if (!hasMetadata(MODULE_METADATA_DECORATOR_KEY, rootModule)) {
        throw new Error(
          `${rootModule.name} 不是一个合法模块，该模块是否使用了 @Module() ?`
        )
      }

      // 获取根模块的元数据
      const metadata = getMetadata(MODULE_METADATA_DECORATOR_KEY, rootModule) || {}
      const {
        controllers = [],
        providers = [],
        imports = []
      } = metadata

      // 处理导入的模块
      for (const importedModule of imports) {
        if (!hasMetadata(MODULE_METADATA_DECORATOR_KEY, importedModule)) {
          throw new Error(
            `${importedModule.name}模块不是一个合法模块！`
          )
        }

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
        globalProviders.forEach(provider => {
          if (!providers.includes(provider)) {
            providers.push(provider)
          }
        })
      }

      this.providers = providers

      // 注册provider到容器中
      providers.forEach(provider => {
        container.register(provider, provider)
      })

      // 调用模块初始化钩子
      await this.callModuleInit(providers, container)

      bootstrap(app, router, {
        controllers,
        providers,
        container
      })

      app.use(router.routes())
      app.use(router.allowedMethods())

      // 将模块引用添加到上下文中
      app.context.moduleRef = moduleRef

      // 调用应用程序启动钩子
      await this.callBootstrap(providers, container)

      // 设置进程退出时的处理函数
      this.setupCleanup()

      return app
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`应用初始化失败: ${error.message}`)
      }
      throw new Error('应用初始化失败: 不明错误')
    }
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
    return instance && typeof instance[hook] === 'function'
  }
} 