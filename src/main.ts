import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PostsModule } from './posts/posts.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

const swaggerStyle = {
  swaggerOptions: {
    persistAuthorization: true,
  }
};

async function bootstrap() {
  const logger = new Logger();
  const port = 5000;
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'statics'));
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, skipMissingProperties: false }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('Blog api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const blog = SwaggerModule.createDocument(app, config, {
    include: [PostsModule, UsersModule,RolesModule],
  });
  SwaggerModule.setup('blog', app, blog, swaggerStyle);

  await app.listen(port);
  logger.log(`Server is running on port: ${port}`);
}
bootstrap();
