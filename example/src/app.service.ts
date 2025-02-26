import { Injectable } from '@otdrfu/cute-nestjs'
import type { 
  OnModuleInit, 
  OnApplicationBootstrap, 
  OnModuleDestroy,
  BeforeApplicationShutdown 
} from '@otdrfu/cute-nestjs'

@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown {
  constructor() {
    console.log('🦞lifecycle: AppService constructor')
  }

  async onModuleInit() {
    console.log('🦞lifecycle: Module initialized')
  }

  async onApplicationBootstrap() {
    console.log('🦞lifecycle: Application bootstrapped')
  }

  async beforeApplicationShutdown() {
    console.log('🦞lifecycle: Application preparing to shutdown')
  }

  async onModuleDestroy() {
    console.log('🦞lifecycle: Module being destroyed')
  }

  getHello(): string {
    return 'Hello，cute-nestjs!!'
  }
} 