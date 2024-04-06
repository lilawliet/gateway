import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './utils/config';
import { FeishuModule } from './feishu/feishu.module';
import { CacheModule } from '@nestjs/cache-manager';

/**
 * @nestjs/config 默认会从项目根目录载入并解析一个 .env 文件，从 .env 文件和 process.env 合并环境变量键值对，并将结果存储到一个可以通过 ConfigService 访问的私有结构。
 */

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true, // 不加载.env文件, 使用 YAML 配置
      isGlobal: true,
      load: [getConfig],
    }),
    UserModule,
    FeishuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
