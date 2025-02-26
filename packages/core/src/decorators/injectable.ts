import { hasMetadata, defineMetadata } from '@/utils/metadata'
import { DESIGN_PARAMTYPES_KEY, INJECTABLE_DECORATOR_KEY, SCOPE_OPTIONS_KEY } from '@/utils/const'
import { Scope } from '@/interfaces/scope'

/**
 * Injectable 装饰器选项
 */
export interface InjectableOptions {
  /**
   * Provider的作用域
   * @default Scope.SINGLETON
   */
  scope?: Scope
}

/**
 * 标记一个类可以被依赖注入系统管理
 * @param options 可选的装饰器选项，如作用域
 * @returns 类装饰器
 */
export function Injectable(options: InjectableOptions = {}): ClassDecorator {
  return (target: any) => {
    // 确保类已启用元数据反射
    if (!hasMetadata(DESIGN_PARAMTYPES_KEY, target)) {
      throw new Error(`类 ${target.name} 缺少 TypeScript 生成的 design:paramtypes 元数据。请确保你在 tsconfig.json 中启用了 emitDecoratorMetadata 选项`)
    }
    
    // 标记类可以被注入
    defineMetadata(INJECTABLE_DECORATOR_KEY, true, target)
    
    // 设置作用域选项，默认为单例
    defineMetadata(SCOPE_OPTIONS_KEY, {
      scope: options.scope || Scope.SINGLETON
    }, target)
    
    return target
  }
} 