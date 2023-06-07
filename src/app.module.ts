import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt.config.service';
import { TagsModule } from './tags/tags.module';
import { ArticlesTagsMappingsService } from './articles_tags_mappings/articles_tags_mappings.service';
import { ArticlesTagsMappingsController } from './articles_tags_mappings/articles_tags_mappings.controller';
import { ArticlesTagsMappingsModule } from './articles_tags_mappings/articles_tags_mappings.module';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UsersRepository } from './users/users.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    ArticlesModule,
    UsersModule,
    TagsModule,
    ArticlesTagsMappingsModule,
    CommentsModule,
  ],
  controllers: [
    AppController,
    ArticlesTagsMappingsController,
    CommentsController,
  ],
  providers: [
    AppService,
    ArticlesTagsMappingsService,
    CommentsService,
    AuthMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/api/articles', method: RequestMethod.POST },
        { path: '/api/articles/:id', method: RequestMethod.PUT },
        { path: '/api/articles/:id', method: RequestMethod.DELETE },
      );
  }
}
