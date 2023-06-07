import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Article_Tag_Mapping } from './articles_tags_mapping.entity';

@Injectable()
export class Articles_Tags_MappingsRepository extends Repository<Article_Tag_Mapping> {
  constructor(private dataSource: DataSource) {
    super(Article_Tag_Mapping, dataSource.createEntityManager());
  }

  async getTag(id: number) {
    return await this.createQueryBuilder('articles_tags_mappings')
      .where(`article_id = ${id}`)
      .innerJoinAndSelect('articles_tags_mappings.tag', 'tag.id')
      .getMany();
  }
}
