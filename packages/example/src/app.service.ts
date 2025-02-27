import { Injectable } from '@otdrfu/cute-nestjs'
import type { 
  OnModuleInit, 
  OnApplicationBootstrap, 
  OnModuleDestroy,
  BeforeApplicationShutdown 
} from '@otdrfu/cute-nestjs'

@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown {
  constructor() {}

  async onModuleInit() {
    console.log('🦞生命周期: onModuleInit')
  }

  async onApplicationBootstrap() {
    console.log('🦞生命周期: onApplicationBootstrap')
  }

  async beforeApplicationShutdown() {
    console.log('🦞生命周期: beforeApplicationShutdown')
  }

  async onModuleDestroy() {
    console.log('🦞生命周期: onModuleDestroy')
  }

  getHello(): string {
    return 'Hello，cute-nestjs!!!'
  }
} 