/**
 * 定义provider的作用域
 * 
 * 作用域决定了provider实例的生命周期和共享方式
 */
export enum Scope {
  /**
   * 默认作用域
   * 行为与 SINGLETON 相同，为向后兼容保留
   */
  DEFAULT = 'DEFAULT',
  
  /**
   * 单例作用域
   * 整个应用中只创建一个实例，所有注入点共享同一个实例
   */
  SINGLETON = 'SINGLETON',
  
  /**
   * 请求作用域
   * 每个请求创建一个新实例，同一请求内的注入点共享同一实例
   */
  REQUEST = 'REQUEST',
  
  /**
   * 瞬态作用域
   * 每次注入都创建一个新实例，不共享实例
   */
  TRANSIENT = 'TRANSIENT'
} 