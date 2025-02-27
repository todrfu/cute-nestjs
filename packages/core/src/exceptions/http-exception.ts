/**
 * HTTP 异常基类
 */
export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = 500,
    public readonly code?: string,
    public readonly data?: any
  ) {
    super(message)
    this.name = this.constructor.name
  }

  /**
   * 获取错误响应对象
   */
  getResponse() {
    return {
      status: this.status,
      code: this.code || this.name,
      message: this.message,
      data: this.data
    }
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestException extends HttpException {
  constructor(message = '请求参数错误', code?: string, data?: any) {
    super(message, 400, code, data)
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedException extends HttpException {
  constructor(message = '未授权', code?: string, data?: any) {
    super(message, 401, code, data)
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenException extends HttpException {
  constructor(message = '禁止访问', code?: string, data?: any) {
    super(message, 403, code, data)
  }
}

/**
 * 404 Not Found
 */
export class NotFoundException extends HttpException {
  constructor(message = '资源不存在', code?: string, data?: any) {
    super(message, 404, code, data)
  }
}

/**
 * 409 Conflict
 */
export class ConflictException extends HttpException {
  constructor(message = '资源冲突', code?: string, data?: any) {
    super(message, 409, code, data)
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerErrorException extends HttpException {
  constructor(message = '服务器内部错误', code?: string, data?: any) {
    super(message, 500, code, data)
  }
} 