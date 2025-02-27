/**
 * 模块初始化时的生命周期钩子
 * 在依赖注入完成后调用
 */
export interface OnModuleInit {
  /**
   * 模块初始化钩子方法
   * 在所有依赖注入完成后调用
   */
  onModuleInit(): Promise<void> | void
}

/**
 * 应用程序启动完成时的生命周期钩子
 * 在所有模块都初始化完成后调用
 */
export interface OnApplicationBootstrap {
  /**
   * 应用程序启动完成钩子方法
   * 在所有模块都初始化完成后调用
   */
  onApplicationBootstrap(): Promise<void> | void
}

/**
 * 应用程序准备关闭时的生命周期钩子
 * 在收到终止信号时调用
 */
export interface BeforeApplicationShutdown {
  /**
   * 应用程序准备关闭钩子方法
   * 在收到终止信号时调用，可以用于清理资源
   */
  beforeApplicationShutdown(): Promise<void> | void
}

/**
 * 模块销毁时的生命周期钩子
 * 在模块被销毁前调用
 */
export interface OnModuleDestroy {
  /**
   * 模块销毁钩子方法
   * 在模块被销毁前调用，可以用于清理资源
   */
  onModuleDestroy(): Promise<void> | void
} 