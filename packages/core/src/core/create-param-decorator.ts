import { PARAM_FULLDATA_KEY } from '@/utils/const'
import type { ParamTypes, Constructor } from '@/interfaces/common'
import type { HttpAdapter } from '@/interfaces/http-adapter'

interface ParamDecoratorOptions<TContext = any> {
  ctx: TContext
  paramType: Constructor
  paramName: string
  httpAdapter: HttpAdapter<TContext>
}

/**
 * 创建参数装饰器处理函数
 * @param type 参数类型
 */
export const createParamDecorator = <TContext = any>(type: ParamTypes) => {
  return ({ ctx, paramType, paramName, httpAdapter }: ParamDecoratorOptions<TContext>) => {
    let value: any

    switch (type) {
      case 'query':
        value = httpAdapter.getRequestQuery(ctx)
        break
      case 'param':
        value = httpAdapter.getRequestParams(ctx)
        break
      case 'body':
        value = httpAdapter.getRequestBody(ctx)
        break
    }

    // 如果指定了参数名且不是获取全量数据,则获取指定字段
    if (paramName !== PARAM_FULLDATA_KEY && value) {
      value = value[paramName]
    }

    // 如果值为undefined且有默认值,则使用默认值
    if (value === undefined && paramType?.prototype?.defaultValue !== undefined) {
      value = paramType.prototype.defaultValue
    }

    return value
  }
} 