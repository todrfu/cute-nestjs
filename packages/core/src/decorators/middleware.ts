import { defineMetadata } from '@/utils/metadata'
import { MIDDLEWARE_DECORATOR_KEY } from '@/utils/const'

/**
 * 中间件装饰器
 * 
 * 标记一个类为中间件，使其能被自动注册到应用中
 * 中间件类必须实现 resolve() 方法，该方法返回一个 Koa 中间件函数
 */
export function Middleware(): ClassDecorator {
  return (target: any) => {
    defineMetadata(MIDDLEWARE_DECORATOR_KEY, true, target)
    return target
  }
}
