import { hasMetadata, defineMetadata } from '@/utils/metadata'
import { INJECTABLE_DECORATOR_KEY, MODULE_METADATA_DECORATOR_KEY } from '@/utils/const'
import type { Constructor } from '@/interfaces'

export interface ModuleMetadata {
  imports?: Constructor[]
  controllers?: Constructor[]
  providers?: Constructor[]
  exports?: Constructor[]
  global?: boolean
}

export interface DynamicModule extends ModuleMetadata {
  module: Constructor
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    // 验证 providers
    metadata.providers?.forEach(provider => {
      if (!hasMetadata(INJECTABLE_DECORATOR_KEY, provider)) {
        throw new Error(
          `Provider ${provider.name} 必须使用 @Injectable() 装饰`
        )
      }
    })

    // 验证 controllers
    metadata.controllers?.forEach(controller => {
      if (!hasMetadata(INJECTABLE_DECORATOR_KEY, controller)) {
        throw new Error(
          `Controller ${controller.name} 必须使用 @Injectable() 装饰`
        )
      }
    })

    defineMetadata(MODULE_METADATA_DECORATOR_KEY, metadata, target)
    return target
  }
} 