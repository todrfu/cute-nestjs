import { getMetadata, defineMetadata } from '@/utils/metadata'
import { QUERY_DECORATOR_KEY, PARAM_FULLDATA_KEY } from '@/utils/const'

/**
 * 获取请求参数
 * @param name 可选参数，用于指定获取请求参数中的哪个字段
 * @returns 装饰器函数
 */
export const Query = (name?: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    // 获取该方法入参
    const funcParamsMetadata = getMetadata(QUERY_DECORATOR_KEY, target, propertyKey) || []

    funcParamsMetadata[parameterIndex] = {
      // 仅当name为undefined时默认获取全量body参数
      name: name === void 0 ? PARAM_FULLDATA_KEY : name,
      type: 'query',
      parameterIndex,
    }
    defineMetadata(QUERY_DECORATOR_KEY, funcParamsMetadata, target, propertyKey)
  }
}
