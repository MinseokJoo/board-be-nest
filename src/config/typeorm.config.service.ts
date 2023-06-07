import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Article } from 'src/articles/articles.entity';
import { Article_Tag_Mapping } from 'src/articles_tags_mappings/articles_tags_mapping.entity';
import { Comment } from 'src/comments/comments.entity';
import { Tag } from 'src/tags/tags.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [Article, User, Tag, Comment, Article_Tag_Mapping],
      synchronize: false,
      logging: true,
    };
  }
}
