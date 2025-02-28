/**
 * 通用构造函数类型
 * 
 * 表示可以被实例化的类的类型
 * @template T 构造函数创建的实例类型，默认为 any
 */
export interface Constructor<T = any> {
  /**
   * 构造函数签名
   * @param args 构造函数参数
   * @returns 构造函数创建的实例
   */
  new (...args: any[]): T
}

/**
 * 控制器获取客户端入参的三种方式(@Query、@Param、@Body)
 */
export type ParamTypes = 'query' | 'param' | 'body'
