import { CuteNestFactory } from '@otdrfu/cute-nestjs'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await CuteNestFactory.create(AppModule)
    
    app.listen(3000, () => {
      console.log('🚀 服务器启动成功: http://localhost:3000')
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

bootstrap()
