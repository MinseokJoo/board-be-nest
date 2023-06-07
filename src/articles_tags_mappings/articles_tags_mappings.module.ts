import { Module } from '@nestjs/common';
import { ArticlesTagsMappingsController } from './articles_tags_mappings.controller';
import { ArticlesTagsMappingsService } from './articles_tags_mappings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article_Tag_Mapping } from './articles_tags_mapping.entity';
import { ArticlesRepository } from 'src/articles/articles.repotiroy';

@Module({
  imports: [TypeOrmModule.forFeature([Article_Tag_Mapping])],
  controllers: [ArticlesTagsMappingsController],
  providers: [ArticlesTagsMappingsService, ArticlesRepository],
})
export class ArticlesTagsMappingsModule {}
