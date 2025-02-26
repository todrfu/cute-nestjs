import { getMetadata, defineMetadata } from '../utils/metadata'
import { BODY_DECORATOR_KEY, PARAM_FULLDATA_KEY } from '../utils/const'

/**
 * 获取请求体中的数据
 * @param name 可选参数，用于指定获取请求体中的哪个字段
 * @returns
 */
export const Body = (name?: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const bodyMetadata = getMetadata(BODY_DECORATOR_KEY, target, propertyKey) || []
  
    // 如果name为空，则默认获取全量body参数
    bodyMetadata[parameterIndex] = name ?? PARAM_FULLDATA_KEY
    defineMetadata(BODY_DECORATOR_KEY, bodyMetadata, target, propertyKey)
  }
}
