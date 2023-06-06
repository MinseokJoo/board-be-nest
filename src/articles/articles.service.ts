import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './articles.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articlesRepository: Repository<Article>,
    private jwtService: JwtService,
  ) {}

  async myArticles(cookie) {
    const { id } = await this.jwtService.verify(cookie);

    return await this.articlesRepository.find({
      where: { user: id },
      relations: ['user'],
    });
  }
}
