/**
 * 请求前置处理钩子
 */
export interface BeforeRequest<TContext> {
  beforeRequest(context: TContext): Promise<void> | void
}

/**
 * 请求后置处理钩子
 */
export interface AfterRequest<TContext> {
  afterRequest(context: TContext, result: any): Promise<any> | any
}

/**
 * 请求错误处理钩子
 */
export interface OnRequestError<TContext> {
  onRequestError(context: TContext, error: Error): Promise<any> | any
}

/**
 * 请求完成处理钩子
 */
export interface OnRequestComplete<TContext> {
  onRequestComplete(context: TContext): Promise<void> | void
} 