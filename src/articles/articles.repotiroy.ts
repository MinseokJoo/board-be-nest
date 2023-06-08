import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Article } from './articles.entity';

@Injectable()
export class ArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }

  async pagingArticles(page): Promise<[Article[], number]> {
    const count = await this.count();

    const rows = await this.createQueryBuilder('articles')
      .orderBy('articles.createdAt', 'DESC')
      .leftJoinAndSelect('articles.user', 'users')
      .offset((page - 1) * 8)
      .limit(8)
      .getMany();

    return [rows, count];
  }

  async postArticle(title: string, contents: string, id: number) {
    return await this.createQueryBuilder('articles')
      .insert()
      .into(Article)
      .values({ title, contents, user_id: id })
      .execute();
  }

  async getArticleAndUserInfo(id) {
    return await this.createQueryBuilder('articles')
      .leftJoinAndSelect('articles.user', 'users.id')
      .where(id)
      .getOne();
  }
}
