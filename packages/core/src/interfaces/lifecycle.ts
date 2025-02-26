/**
 * 模块销毁生命周期接口
 * 
 * 实现此接口的Provider可以在模块销毁前执行清理工作
 */
export interface OnModuleInit {
  onModuleInit(): Promise<void> | void
}

/**
 * 模块销毁生命周期接口
 * 
 * 实现此接口的Provider可以在模块销毁前执行清理工作
 */
export interface OnModuleDestroy {
  /**
   * 在模块销毁前调用的钩子方法
   * 
   * 用于清理资源、关闭连接、取消订阅等操作
   * @returns void 或 Promise<void>
   */
  onModuleDestroy(): Promise<void> | void
}

/**
 * 应用关闭生命周期接口
 * 
 * 实现此接口的Provider可以在应用关闭前执行清理工作
 */
export interface BeforeApplicationShutdown {
  /**
   * 在应用关闭前调用的钩子方法
   * 
   * 用于执行清理工作，如关闭数据库连接、释放资源等
   * @returns void 或 Promise<void>
   */
  beforeApplicationShutdown(): Promise<void> | void
}

/**
 * 应用启动生命周期接口
 * 
 * 实现此接口的Provider可以在应用启动时执行初始化工作
 */
export interface OnApplicationBootstrap {
  /**
   * 在应用启动时调用的钩子方法
   * 
   * 用于执行初始化工作，如数据库连接、缓存初始化等
   * @returns void 或 Promise<void>
   */
  onApplicationBootstrap(): Promise<void> | void
} 