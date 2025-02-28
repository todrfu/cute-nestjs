import type { Constructor } from './common'
import type { Container } from '@/core/container'

/**
 * 初始化选项接口
 */
export interface BootstrapOptions {
  /**
   * 控制器类列表
   */
  controllers: Constructor[]

  /**
   * 提供者类列表
   */
  providers: Constructor[]

  /**
   * 依赖注入容器实例
   */
  container: Container
}