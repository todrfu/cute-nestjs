import { defineMetadata } from '@/utils/metadata'
import { CONTROLLER_DECORATOR_KEY } from '@/utils/const'

export function Controller(path?: string): ClassDecorator {
  return (target: any) => {
    defineMetadata(CONTROLLER_DECORATOR_KEY, path, target)
  }
}
