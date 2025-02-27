import { Injectable } from '@otdrfu/cute-nestjs'
import type { 
  BeforeRequest, 
  AfterRequest, 
  OnRequestError, 
  OnRequestComplete 
} from '@otdrfu/cute-nestjs'

@Injectable()
export class LifecycleProvider implements BeforeRequest, AfterRequest, OnRequestError, OnRequestComplete {
  async beforeRequest(context: any) {
    console.log('🎯 请求前处理')
  }

  async afterRequest(context: any, result: any) {
    console.log('🎯 请求后处理')
    return {
      code: 0,
      data: result,
      timestamp: Date.now()
    }
  }

  async onRequestError(context: any, error: Error) {
    console.error('🎯 请求错误处理:', error.message)
    return {
      code: -1,
      message: error.message,
      timestamp: Date.now()
    }
  }

  async onRequestComplete(context: any) {
    console.log('🎯 请求完成处理')
  }
} 