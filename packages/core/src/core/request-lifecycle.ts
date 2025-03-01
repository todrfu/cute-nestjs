import { Container } from './container'
import { HttpException } from '@/exceptions/http-exception'
import type { Constructor } from '@/interfaces/common'
import type {
  BeforeRequest,
  AfterRequest,
  OnRequestError,
  OnRequestComplete
} from '@/interfaces/request-lifecycle'

/**
 * 请求生命周期管理器
 * 负责管理请求的生命周期钩子，包括：
 * - 请求前处理
 * - 请求后处理
 * - 错误处理
 * - 请求完成处理
 */
export class RequestLifecycle<TContext> {
  constructor(private readonly container: Container) {}

  /**
   * 执行请求前置处理
   * @param context 请求上下文
   * @param providers Provider列表
   */
  async beforeRequest(context: TContext, providers: Constructor[]): Promise<void> {
    for (const provider of providers) {
      const instance = this.container.get(provider)
      if (this.implementsInterface<BeforeRequest<TContext>>(instance, 'beforeRequest')) {
        await instance.beforeRequest(context)
      }
    }
  }

  /**
   * 执行请求后置处理
   * @param context 请求上下文
   * @param result 请求结果
   * @param providers Provider列表
   */
  async afterRequest(context: TContext, result: any, providers: Constructor[]): Promise<any> {
    let processedResult = result
    for (const provider of providers) {
      const instance = this.container.get(provider)
      if (this.implementsInterface<AfterRequest<TContext>>(instance, 'afterRequest')) {
        processedResult = await instance.afterRequest(context, processedResult)
      }
    }
    return processedResult
  }

  /**
   * 执行错误处理
   * @param context 请求上下文
   * @param error 错误对象
   * @param providers Provider列表
   */
  async handleError(context: TContext, error: Error, providers: Constructor[]): Promise<{status: number} & Record<string, any>> {
    // 转换为 HTTP 异常
    const httpError = this.normalizeError(error)

    // 执行错误处理钩子
    for (const provider of providers) {
      const instance = this.container.get(provider)
      if (this.implementsInterface<OnRequestError<TContext>>(instance, 'onRequestError')) {
        try {
          const result = await instance.onRequestError(context, httpError)
          if (result !== undefined) {
            return result
          }
        } catch (err) {
          console.error('错误处理器执行失败:', err)
        }
      }
    }

    // 如果没有处理器处理错误，返回默认错误响应
    return httpError.getResponse()
  }

  /**
   * 执行请求完成处理
   * @param context 请求上下文
   * @param providers Provider列表
   */
  async onComplete(context: TContext, providers: Constructor[]): Promise<void> {
    for (const provider of providers) {
      const instance = this.container.get(provider)
      if (this.implementsInterface<OnRequestComplete<TContext>>(instance, 'onRequestComplete')) {
        try {
          await instance.onRequestComplete(context)
        } catch (err) {
          console.error('请求完成处理器执行失败:', err)
        }
      }
    }
  }

  /**
   * 检查实例是否实现了指定声明周期钩子
   */
  private implementsInterface<T>(instance: any, methodName: keyof T): instance is T {
    return instance && typeof instance[methodName] === 'function'
  }

  /**
   * 将错误对象标准化为 HTTP 异常
   */
  private normalizeError(error: Error): HttpException {
    if (error instanceof HttpException) {
      return error
    }
    return new HttpException(error.message)
  }
} 