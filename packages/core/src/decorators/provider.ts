import { PROVIDER_DECORATOR_KEY } from '@/utils/const'
import { defineMetadata } from '@/utils/metadata'

export const Provider = () => {
  return (target: any) => {
    defineMetadata(PROVIDER_DECORATOR_KEY, target.name, target)
  }
}
