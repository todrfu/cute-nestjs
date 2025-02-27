import type { Middleware } from '@/interfaces/middleware'

/**
 * 类型守卫：检查一个对象是否实现了 Middleware 接口
 * @param value 要检查的对象
 * @returns 是否是中间件
 */
export function isMiddleware(value: any): value is Middleware {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.resolve === 'function' &&
    // 检查 resolve 方法是否在原型链上
    Object.getPrototypeOf(value).hasOwnProperty('resolve')
  )
} 