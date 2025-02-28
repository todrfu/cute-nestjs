import { PARAM_FULLDATA_KEY } from '@/utils/const'
import type { Context } from 'koa'
import type { ParamTypes, Constructor } from '@/interfaces/common'

interface ParamDecoratorOptions {
  ctx: Context
  paramType: Constructor
  paramName: string
  contextId?: string
}

export function createParamDecorator(type: ParamTypes) {
  return function resolveParam({ ctx, paramType,  paramName }: ParamDecoratorOptions) {
    const typeName = paramType.name
    const key = paramName

    if (!key) return null

    // 获取参数值
    let value: any;
    
    // 如果是请求完整数据
    if (key === PARAM_FULLDATA_KEY) {
      switch (type) {
        case 'query':
          value = ctx.query;
          break;
        case 'param':
          value = ctx.params;
          break;
        case 'body':
          value = ctx.request.body;
          break;
      }
    } else {
      // 处理单个参数
      switch (type) {
        case 'query': {
          value = ctx.query[key];
          // 如果是字符串且目标类型是 Number，进行类型转换
          if (typeof value === 'string' && typeName === 'Number') {
            value = Number(value);
          }
          break;
        }
        case 'param':
          value = ctx.params[key];
          // 如果是字符串且目标类型是 Number，进行类型转换
          if (typeof value === 'string' && typeName === 'Number') {
            value = Number(value);
          }
          break;
        case 'body':
          value = ctx.request.body[key];
          break;
      }
    }
    
    // 如果值是复杂对象且需要依赖注入，可以在这里使用 contextId
    // 例如，如果我们需要从容器中获取实例：
    // if (needsInjection(value) && ctx.container) {
    //   return ctx.container.get(paramType, contextId);
    // }
    
    return value;
  }
} 