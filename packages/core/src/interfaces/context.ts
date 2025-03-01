/**
 * HTTP上下文状态接口
 * 定义了请求上下文中的状态数据结构
 */
export interface HttpContextState {
  [key: string]: any
}

/**
 * 通用HTTP上下文接口
 * 定义了框架所需的最小上下文接口
 */
export interface HttpContext {
  state: HttpContextState
  /**
   * 请求路径
   */
  path: string
} 