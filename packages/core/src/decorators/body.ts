import { getMetadata, defineMetadata } from '@/utils/metadata'
import { BODY_DECORATOR_KEY, PARAM_FULLDATA_KEY } from '@/utils/const'

/**
 * 获取请求体中的数据
 * @param name 可选参数，用于指定获取请求体中的哪个字段
 * @returns
 */
export const Body = (name?: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    // 获取该方法入参
    const funcParamsMetadata = getMetadata(BODY_DECORATOR_KEY, target, propertyKey) || []
  
    funcParamsMetadata[parameterIndex] = {
      // 仅当name为undefined时默认获取全量body参数
      name: name === void 0 ? PARAM_FULLDATA_KEY : name,
      type: 'body',
      parameterIndex,
    }
    defineMetadata(BODY_DECORATOR_KEY, funcParamsMetadata, target, propertyKey)
  }
}
