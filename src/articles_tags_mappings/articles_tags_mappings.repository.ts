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

  async todayTags(yesterday) {
    return await this.createQueryBuilder('articles_tags_mappings')
      .select('tag_id')
      .groupBy('tag_id')
      .addSelect('COUNT (*) AS tagsCount')
      .where(`articles_tags_mappings.createdAt >= ${yesterday}`, {
        createdAt: yesterday,
      })
      .orderBy('tagsCount', 'DESC')
      .limit(10)
      .leftJoinAndSelect('articles_tags_mappings.tag', 'tag.id')
      .getRawMany();
  }

  async articlesByTag(id, page) {
    return await this.createQueryBuilder('articles_tags_mappings')
      .where(id)
      .leftJoinAndSelect('articles_tags_mappings.article', 'articles')
      .offset((page - 1) * 8)
      .limit(8)
      .orderBy('articles.createdAt', 'DESC')
      .getMany();
  }
}
