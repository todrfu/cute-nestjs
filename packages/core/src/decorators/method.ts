import { getMetadata, defineMetadata } from '@/utils/metadata'
import {
  GET_DECORATOR_KEY,
  POST_DECORATOR_KEY,
  PUT_DECORATOR_KEY,
  DELETE_DECORATOR_KEY,
  PATCH_DECORATOR_KEY,
} from '@/utils/const'

const decorator = (decoratorKey: string, method: string, path: string) => (target: any, propertyKey: string) => {
  const funcMetadata = getMetadata(decoratorKey, target) || []
  funcMetadata.push({
    path,
    method,
    funcName: propertyKey,
  })
  defineMetadata(decoratorKey, funcMetadata, target)
}

export const Get = (path: string) => decorator(GET_DECORATOR_KEY, 'get', path)
export const Post = (path: string) => decorator(POST_DECORATOR_KEY, 'post', path)
export const Put = (path: string) => decorator(PUT_DECORATOR_KEY, 'put', path)
export const Delete = (path: string) => decorator(DELETE_DECORATOR_KEY, 'delete', path)
export const Patch = (path: string) => decorator(PATCH_DECORATOR_KEY, 'patch', path)
