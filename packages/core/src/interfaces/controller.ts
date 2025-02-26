/**
 * 控制器接口
 * 
 * 定义控制器的基本结构，控制器负责处理传入的请求并返回对客户端的响应
 */
export interface Controll {
  /**
   * 索引签名，允许控制器包含任意属性
   */
  [key: string]: any
}

/**
 * 控制器选项接口
 * 
 * 定义控制器的一些可选配置，如路径、版本等
 */
export interface ControllerOptions {
  /**
   * 控制器路径
   */
  path?: string
}

/**
 * 路由元数据接口
 * 
 * 描述路由的元数据，包括路径、方法、属性键和参数元数据
 */
export interface RouteMetadata {
  /**
   * 路由路径
   */
  path: string
  /**
   * 路由方法
   */
  method: string
  /**
   * 属性键
   */
  propertyKey: string | symbol
  /**
   * 参数元数据
   */
  parameters: ParameterMetadata[]
}

/**
 * 参数元数据接口
 * 
 * 描述路由参数的元数据，包括索引、类型和可选数据
 */
export interface ParameterMetadata {
  /**
   * 参数索引
   */
  index: number
  /**
   * 参数类型
   */
  type: string
  /**
   * 可选数据
   */
  data?: any
}
