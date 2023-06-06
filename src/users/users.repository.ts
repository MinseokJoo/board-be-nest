import { Injectable } from '@nestjs/common';
import { DataSource, Repository, getRepository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    // DataSource는 데이터베이스 연결에 대한 추상화를 제공하는 클래스
    super(User, dataSource.createEntityManager());
  }

  async userArticles(id) {
    const result = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.articles', 'articles')
      .orderBy('articles.createdAt', 'DESC')
      .limit(5)
      .where(id)
      .getMany();

    return result;
  }
}
