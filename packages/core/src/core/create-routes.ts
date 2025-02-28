import Router from 'koa-router'
import { RequestLifecycle } from '@/core/request-lifecycle'
import { getMetadata } from '@/utils/metadata'
import { createInstance } from '@/utils/create-instance'
import { createParamDecorator } from './create-param-decorator'
import {
  PROVIDER_DECORATOR_KEY,
  CONTROLLER_DECORATOR_KEY,
  GET_DECORATOR_KEY,
  POST_DECORATOR_KEY,
  PUT_DECORATOR_KEY,
  DELETE_DECORATOR_KEY,
  PATCH_DECORATOR_KEY,
  QUERY_DECORATOR_KEY,
  PARAM_DECORATOR_KEY,
  BODY_DECORATOR_KEY,
  DESIGN_PARAMTYPES_KEY,
  REQUEST_CONTEXT_ID,
} from '@/utils/const'

import type { Context } from 'koa'
import type { Constructor, ParamTypes } from '@/interfaces/common'
import type { HttpAdapter } from '@/interfaces/http-adapter'

// 存储已注册的Provider类名
const providerClsList: string[] = []

// 支持的 HTTP 方法装饰器列表
const METHOD_DECORATORS = [
  GET_DECORATOR_KEY,
  POST_DECORATOR_KEY,
  PUT_DECORATOR_KEY,
  DELETE_DECORATOR_KEY,
  PATCH_DECORATOR_KEY,
] as const

/**
 * 路由创建配置接口
 */
interface CreateRoutesOptions {
  router: Router
  controller: Constructor
  container: any
  providers: Constructor[]
  httpAdapter: HttpAdapter
}

/**
 * 创建路由
 * 根据控制器的装饰器信息创建对应的路由处理函数
 */
export function createRoutes(options: CreateRoutesOptions) {
  const { router, controller: cls, container, providers = [], httpAdapter } = options

  // 创建请求生命周期管理器
  const lifecycle = new RequestLifecycle(container)

  // 处理Provider装饰器
  const providerName = getMetadata(PROVIDER_DECORATOR_KEY, cls)
  if (providerName) providerClsList.push(providerName)

  // 获取控制器路径前缀
  const controllerPath = getMetadata(CONTROLLER_DECORATOR_KEY, cls) || ''

  // 遍历所有 HTTP 方法装饰器，创建路由
  const routes = METHOD_DECORATORS.map((decorator) => getMetadata(decorator, cls.prototype) || []).flat()
  routes.forEach(({ path, method, funcName }) => {
    // 组合完整路径
    const fullPath = `${controllerPath.path}${path === '/' ? '' : path}`

    if (!fullPath) return

    // 创建路由处理函数
    router[method](fullPath, async (ctx: Context) => {
      try {
        // 执行请求前置处理
        await lifecycle.beforeRequest(ctx, providers)

        // 在处理路由时获取上下文ID
        const contextId = ctx.state[REQUEST_CONTEXT_ID]

        // 创建控制器实例
        const instance = createInstance(cls, container, contextId)

        // 获取方法参数类型（间接获得路由对应函数入参的个数）
        const paramTypes = getMetadata(DESIGN_PARAMTYPES_KEY, cls.prototype, funcName) || []

        // 获取各种param装饰器的元数据
        const paramDecorators = getMetadata(PARAM_DECORATOR_KEY, cls.prototype, funcName) || []

        // 获取各种query装饰器的元数据
        const queryDecorators = getMetadata(QUERY_DECORATOR_KEY, cls.prototype, funcName) || []

        // 获取各种body装饰器的元数据
        const bodyDecorators = getMetadata(BODY_DECORATOR_KEY, cls.prototype, funcName) || []
        
        const params = paramDecorators.concat(queryDecorators).concat(bodyDecorators).flat().sort((a, b) => a.parameterIndex - b.parameterIndex)

        // 处理方法参数
        const args = params.map(
          (param: { name: string; type: ParamTypes; paramType: string }, index: number) => {
            return createParamDecorator(param.type)({
              ctx,
              paramType: paramTypes[index],
              paramName: param.name,
            })
          }
        )

        // 调用控制器方法
        const result = await instance[funcName](...args)

        // 执行请求后置处理
        const processedResult = await lifecycle.afterRequest(ctx, result, providers)

        // 使用适配器设置响应
        httpAdapter.setResponse(ctx, processedResult)
      } catch (error: unknown) {
        // 执行错误处理
        const errorResponse = await lifecycle.handleError(ctx, error as Error, providers)
        // 使用适配器设置错误响应
        httpAdapter.setResponse(ctx, {
          ...errorResponse,
          status: errorResponse.status || 500,
        })
      } finally {
        // 执行请求完成处理
        await lifecycle.onComplete(ctx, providers)
      }
    })
  })
}
