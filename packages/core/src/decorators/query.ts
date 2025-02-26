import { getMetadata, defineMetadata } from '../utils/metadata'
import { QUERY_DECORATOR_KEY, PARAM_FULLDATA_KEY } from '../utils/const'

/**
 * 获取请求参数
 * @param name 可选参数，用于指定获取请求参数中的哪个字段
 * @returns 装饰器函数
 */
export const Query = (name?: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const queryMetadata = getMetadata(QUERY_DECORATOR_KEY, target, propertyKey) || []
    // 如果name为空，则默认获取全量query参数
    queryMetadata[parameterIndex] = name ?? PARAM_FULLDATA_KEY
    defineMetadata(QUERY_DECORATOR_KEY, queryMetadata, target, propertyKey)
  }
}
