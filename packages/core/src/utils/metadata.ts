import 'reflect-metadata';

/**
 * 获取元数据
 * @param key 元数据键
 * @param target 目标对象
 * @param propertyKey 属性键
 */
export const getMetadata = (key: string, target: any, propertyKey?: string) => {
  return Reflect.getMetadata(key, target, propertyKey)
}

/**
 * 设置元数据
 * @param key 元数据键
 * @param value 元数据值
 * @param target 目标对象
 * @param propertyKey 属性键
 */
export const defineMetadata = (key: string, value: any, target: any, propertyKey?: string) => {
  Reflect.defineMetadata(key, value, target, propertyKey)
}

export const hasMetadata = (metadataKey: string, target: Object) => Reflect.hasMetadata(metadataKey, target)