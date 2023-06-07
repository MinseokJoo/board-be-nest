import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { ArticlesRepository } from './articles.repotiroy';
import { TagsRepository } from 'src/tags/tags.repository';
import { Articles_Tags_MappingsRepository } from 'src/articles_tags_mappings/articles_tags_mappings.repository';
import { Article_Tag_Mapping } from 'src/articles_tags_mappings/articles_tags_mapping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Article_Tag_Mapping]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    ArticlesRepository,
    TagsRepository,
    Articles_Tags_MappingsRepository,
  ],
})
export class ArticlesModule {}
