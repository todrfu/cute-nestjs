import { CONTROLLER_DECORATOR_KEY } from '@/utils/const'

/**
 * 控制器装饰器
 * @param path 路由前缀
 */
export function Controller(path = ''): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(CONTROLLER_DECORATOR_KEY, { path }, target)
  }
}
