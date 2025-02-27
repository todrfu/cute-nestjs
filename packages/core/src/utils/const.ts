/**
 * TypeScript 反射元数据键
 * 用于获取属性的类型信息
 */
export const DESIGN_TYPE_KEY = 'design:type'

/**
 * TypeScript 反射元数据键
 * 用于获取构造函数参数的类型信息
 */
export const DESIGN_PARAMTYPES_KEY = 'design:paramtypes'

/**
 * 模块装饰器的元数据键
 * 用于存储模块的配置信息（controllers、providers、imports等）
 */
export const MODULE_METADATA_DECORATOR_KEY = 'decorator:module_metadata'

/**
 * 参数装饰器的特殊键
 * 用于标识获取完整的请求参数数据
 */
export const PARAM_FULLDATA_KEY = '__param_fulldata__'

/**
 * 路由参数装饰器键
 * 用于处理路由参数，如 @Param('id')
 */
export const PARAM_DECORATOR_KEY = 'decorator:param'

/**
 * 查询参数装饰器键
 * 用于处理URL查询参数，如 @Query('name')
 */
export const QUERY_DECORATOR_KEY = 'decorator:query'

/**
 * 请求体装饰器键
 * 用于处理POST请求体数据，如 @Body('data')
 */
export const BODY_DECORATOR_KEY = 'decorator:body'

/**
 * 控制器装饰器键
 * 用于标记一个类为控制器，如 @Controller('/users')
 */
export const CONTROLLER_DECORATOR_KEY = 'decorator:controller'

/**
 * HTTP GET方法装饰器键
 * 用于处理GET请求，如 @Get('/profile')
 */
export const GET_DECORATOR_KEY = 'decorator:get'

/**
 * HTTP POST方法装饰器键
 * 用于处理POST请求，如 @Post('/create')
 */
export const POST_DECORATOR_KEY = 'decorator:post'

/**
 * HTTP PUT方法装饰器键
 * 用于处理PUT请求，如 @Put('/update')
 */
export const PUT_DECORATOR_KEY = 'decorator:put'

/**
 * HTTP DELETE方法装饰器键
 * 用于处理DELETE请求，如 @Delete('/remove')
 */
export const DELETE_DECORATOR_KEY = 'decorator:delete'

/**
 * HTTP PATCH方法装饰器键
 * 用于处理PATCH请求，如 @Patch('/update-partial')
 */
export const PATCH_DECORATOR_KEY = 'decorator:patch'

/**
 * Provider装饰器键
 * 用于标记一个类为服务Provider
 */
export const PROVIDER_DECORATOR_KEY = 'decorator:provider'

/**
 * 注入装饰器键
 * 用于属性注入，如 @Inject() private service: Service
 */
export const INJECT_DECORATOR_KEY = 'decorator:inject'

/**
 * 可注入装饰器键
 * 用于标记一个类可以被注入，如 @Injectable()
 */
export const INJECTABLE_DECORATOR_KEY = 'decorator:injectable'

/**
 * 作用域选项元数据键
 */
export const SCOPE_OPTIONS_KEY = 'scope:options'

/**
 * 请求上下文 ID 键
 */
export const REQUEST_CONTEXT_ID = 'request-context-id'

/**
 * 中间件装饰器键
 * 用于标记一个类为中间件
 */
export const MIDDLEWARE_DECORATOR_KEY = 'decorator:middleware'
