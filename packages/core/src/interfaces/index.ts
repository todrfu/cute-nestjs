import { Constructor } from './common'
import { Container } from './container'

/**
 * 应用引导选项接口
 * 
 * 定义启动应用所需的配置
 */
export interface BootstrapOptions {
  /**
   * 控制器类数组
   * 用于处理HTTP请求
   */
  controllers: Constructor[]
  
  /**
   * Provider类数组
   * 用于提供各种服务和功能
   */
  providers: Constructor[]
  
  /**
   * 依赖注入容器
   * 用于管理应用中的依赖关系
   */
  container: Container
}

// 导出其他接口
export * from './common'
export * from './container'
export * from './controller'
export * from './lifecycle'
export * from './scope'