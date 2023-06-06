import { Controller, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { ArticlesService } from './articles.service';

@Controller('/api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('/mypage')
  async myArticles(@Req() req: Request) {
    const cookie = req.cookies['accessToken'];
    return await this.articlesService.myArticles(cookie);
  }
}
