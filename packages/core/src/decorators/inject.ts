import { INJECT_DECORATOR_KEY, DESIGN_TYPE_KEY } from '../utils/const'
import { getMetadata, defineMetadata } from '../utils/metadata'

export const Inject = () => {
  return (target: any, propertyKey: string) => {
    const propertyType = getMetadata(DESIGN_TYPE_KEY, target, propertyKey)
    const props = getMetadata(INJECT_DECORATOR_KEY, target) || []
    props.push({
      propertyType,
      propertyKey,
    })
    defineMetadata(INJECT_DECORATOR_KEY, props, target)
  }
}
