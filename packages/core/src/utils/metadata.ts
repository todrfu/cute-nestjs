/**
 * 获取元数据
 * @param key 元数据键
 * @param target 目标对象
 * @param propertyKey 属性键
 */
export const getMetadata = (key: string, target: any, propertyKey?: string) => {
  return Reflect.getMetadata(key, target, propertyKey);
};

/**
 * 设置元数据
 * @param key 元数据键
 * @param value 元数据值
 * @param target 目标对象
 * @param propertyKey 属性键
 */
export const defineMetadata = (
  key: string,
  value: any,
  target: any,
  propertyKey?: string
) => {
  Reflect.defineMetadata(key, value, target, propertyKey);
};

/**
 * 检查目标对象是否具有指定的元数据
 * @param metadataKey 元数据键
 * @param target 目标对象
 * @returns 如果目标对象具有指定的元数据，则返回 true，否则返回 false
 */
export const hasMetadata = (metadataKey: string, target: Object) => {
  return Reflect.hasMetadata(metadataKey, target);
};
