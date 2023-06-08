import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tags.entity';
import { TagsRepository } from './tags.repository';
import { Article_Tag_Mapping } from 'src/articles_tags_mappings/articles_tags_mapping.entity';
import { Articles_Tags_MappingsRepository } from 'src/articles_tags_mappings/articles_tags_mappings.repository';
import { Article } from 'src/articles/articles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Article_Tag_Mapping, Article])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository, Articles_Tags_MappingsRepository],
})
export class TagsModule {}
