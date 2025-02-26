import { CuteNestFactory } from '@otdrfu/cute-nestjs'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await CuteNestFactory.create(AppModule)
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
  })
}

bootstrap()
