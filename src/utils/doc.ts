import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../../package.json';

// 默认情况下，在 TS 开发的项目中是没办法导入 .json 后缀的模块，所以可以在 tsconfig.json 中新增 resolveJsonModule 配置即可。

export const generateDocument = (app) => {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
};
