import { getMetadata } from './metadata'
import { INJECT_DECORATOR_KEY } from '../utils/const'
import type { Constructor } from '../interfaces/common'

/**
 * 创建实例
 * @param cls 控制器类
 * @param container 容器
 * @param contextId 可选的上下文ID，用于请求作用域
 */
export function createInstance<T>(cls: Constructor<T>, container: any, contextId?: string): T {
  const instance = Object.defineProperty(container.get(cls, contextId), 'ctx', {
    value: container,
    writable: false,
    enumerable: false
  })

  // 处理注入的属性
  const injectMetadata = getMetadata(INJECT_DECORATOR_KEY, cls.prototype) || []
  injectMetadata.forEach(({ propertyKey, propertyType }) => {
    if (propertyKey === 'ctx') {
      instance[propertyKey] = container
    } else {
      try {
        instance[propertyKey] = container.get(propertyType, contextId)
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`在${cls.name}内${propertyKey}属性inject失败了: ${error.message}`)
        }
        throw new Error(`在${cls.name}内${propertyKey}属性inject失败了: 不明错误`)
      }
    }
  })

  return instance
}
