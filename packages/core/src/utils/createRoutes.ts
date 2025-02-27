import Router from 'koa-router'
import { RequestLifecycle } from '@/core/request-lifecycle'
import { getMetadata } from './metadata'
import { createInstance } from './createInstance'
import { createParamDecorator } from './createParamDecorator'
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
} from './const'

import type { Context } from 'koa'
import type { Constructor } from '@/interfaces/common'

// 存储已注册的Provider类名
const providerClsList: string[] = []

// 支持的 HTTP 方法装饰器列表
const METHOD_DECORATORS = [
  GET_DECORATOR_KEY,
  POST_DECORATOR_KEY,
  PUT_DECORATOR_KEY,
  DELETE_DECORATOR_KEY,
  PATCH_DECORATOR_KEY
] as const

// 参数装饰器到处理函数的映射
const PARAM_HANDLERS = {
  [PARAM_DECORATOR_KEY]: createParamDecorator('param'),
  [QUERY_DECORATOR_KEY]: createParamDecorator('query'),
  [BODY_DECORATOR_KEY]: createParamDecorator('body')
}

/**
 * 创建路由
 * 根据控制器的装饰器信息创建对应的路由处理函数
 * 
 * @param router 路由实例
 * @param cls 控制器类
 * @param container 容器实例
 * @param providers 提供者列表
 */
export function createRoutes(
  router: Router, 
  cls: Constructor, 
  container: any,
  providers: Constructor[] = []
) {
  // 创建请求生命周期管理器
  const lifecycle = new RequestLifecycle(container)

  // 处理Provider装饰器
  const providerName = getMetadata(PROVIDER_DECORATOR_KEY, cls)
  if (providerName) providerClsList.push(providerName)

  // 获取控制器路径前缀
  const controllerPath = getMetadata(CONTROLLER_DECORATOR_KEY, cls) || ''

  // 遍历所有 HTTP 方法装饰器，创建路由
  const routes = METHOD_DECORATORS.map(decorator => getMetadata(decorator, cls.prototype) || []).flat()
  routes.forEach(({ path, method, funcName }) => {
      // 组合完整路径
      const fullPath = `${controllerPath.path}${path === '/' ? '' : path}`

      if (!fullPath) return;

      // 创建路由处理函数
      router[method](fullPath, async (ctx: Context) => {
        try {
          // 执行请求前置处理
          await lifecycle.beforeRequest(ctx, providers)

          // 在处理路由时获取上下文ID
          const contextId = ctx.state[REQUEST_CONTEXT_ID]

          // 创建控制器实例
          const instance = createInstance(cls, container, contextId)

          // 获取方法参数类型
          const paramTypes = getMetadata(DESIGN_PARAMTYPES_KEY, cls.prototype, funcName) || []

          // 获取各种参数装饰器的元数据
          const paramDecorators = METHOD_DECORATORS.map(decorator =>
            getMetadata(decorator, cls.prototype, funcName) || []
          ).flat()

          const queryDecorators = getMetadata(QUERY_DECORATOR_KEY, cls.prototype, funcName) || []
          const bodyDecorators = getMetadata(BODY_DECORATOR_KEY, cls.prototype, funcName) || []

          // 处理方法参数
          const args = paramTypes.map((paramType, index) => {
            if (paramDecorators[index]) {
              return PARAM_HANDLERS[PARAM_DECORATOR_KEY]({
                ctx,
                paramType,
                index,
                keys: paramDecorators,
                type: 'param',
                contextId
              })
            }

            if (queryDecorators[index]) {
              return PARAM_HANDLERS[QUERY_DECORATOR_KEY]({
                ctx,
                paramType,
                index,
                keys: queryDecorators,
                type: 'query',
                contextId
              })
            }

            if (bodyDecorators[index]) {
              return PARAM_HANDLERS[BODY_DECORATOR_KEY]({
                ctx,
                paramType,
                index,
                keys: bodyDecorators,
                type: 'body',
                contextId
              })
            }

            return null
          })

          // 调用控制器方法
          const result = await instance[funcName](...args)

          // 执行请求后置处理
          const processedResult = await lifecycle.afterRequest(ctx, result, providers)

          // 设置响应
          ctx.body = processedResult
        } catch (error: unknown) {
          // 执行错误处理
          const errorResponse = await lifecycle.handleError(ctx, error as Error, providers)
          ctx.status = errorResponse.status
          ctx.body = errorResponse
        } finally {
          // 执行请求完成处理
          await lifecycle.onComplete(ctx, providers)
        }
      })
    })
}
