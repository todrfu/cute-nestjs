import 'reflect-metadata';

// 导出工厂类
export { CuteNestFactory } from '@/core/factory';

// 导出装饰器
export { Controller } from '@/decorators/controller'
export { Get, Post, Put, Delete, Patch } from '@/decorators/method'
export { Body } from '@/decorators/body'
export { Param } from '@/decorators/param'
export { Query } from '@/decorators/query'
export { Module } from '@/decorators/module'
export { Middleware } from '@/decorators/middleware'
export { Injectable } from '@/decorators/injectable'
export { Provider } from '@/decorators/provider'
export { Inject } from '@/decorators/inject'

export {
  PARAM_DECORATOR_KEY,
  QUERY_DECORATOR_KEY,
  BODY_DECORATOR_KEY,
  CONTROLLER_DECORATOR_KEY,
  GET_DECORATOR_KEY,
  POST_DECORATOR_KEY,
  PUT_DECORATOR_KEY,
  DELETE_DECORATOR_KEY,
  PATCH_DECORATOR_KEY,
  INJECT_DECORATOR_KEY,
} from '@/utils/const'

// 导出类型
export type { Constructor } from '@/interfaces/common'
export type { Container } from '@/interfaces/container'
export type { ControllerOptions } from '@/interfaces/controller'
export type { 
  OnModuleInit, 
  OnApplicationBootstrap, 
  BeforeApplicationShutdown, 
  OnModuleDestroy 
} from '@/interfaces/lifecycle'
export type { Scope } from '@/interfaces/scope'
export type { BootstrapOptions } from '@/interfaces/bootstrap'
export type { HttpAdapter, ApplicationOptions } from '@/interfaces/http-adapter'
export type { 
  BeforeRequest, 
  AfterRequest, 
  OnRequestError, 
  OnRequestComplete 
} from '@/interfaces/request-lifecycle'
export type { 
  MiddlewareConsumer, 
  MiddlewareConfigProxy, 
  CuteNestModule 
} from '@/interfaces/middleware'

// 异常类
export {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException
} from '@/exceptions/http-exception';
