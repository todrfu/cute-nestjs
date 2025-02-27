import { getMetadata, defineMetadata } from '@/utils/metadata'
import { PARAM_DECORATOR_KEY, PARAM_FULLDATA_KEY } from '@/utils/const'

/**
 * 获取请求参数
 * @param name 可选参数，用于指定获取请求参数中的哪个字段
 * @return
 */
export const Param = (name: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const paramMetadata = getMetadata(PARAM_DECORATOR_KEY, target, propertyKey) || []
    // 如果name为空，则默认获取全量param参数
    paramMetadata[parameterIndex] = name ?? PARAM_FULLDATA_KEY
    defineMetadata(PARAM_DECORATOR_KEY, paramMetadata, target, propertyKey)
  }
}
