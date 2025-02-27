/**
 * 请求前置处理钩子
 */
export interface BeforeRequest {
  beforeRequest(context: any): Promise<void> | void
}

/**
 * 请求后置处理钩子
 */
export interface AfterRequest {
  afterRequest(context: any, result: any): Promise<any> | any
}

/**
 * 请求错误处理钩子
 */
export interface OnRequestError {
  onRequestError(context: any, error: Error): Promise<any> | any
}

/**
 * 请求完成处理钩子
 */
export interface OnRequestComplete {
  onRequestComplete(context: any): Promise<void> | void
} 