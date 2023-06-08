import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('/api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // 게시글 전체 조회
  @Get('/')
  async allArticles(@Query() query) {
    const page = query.page || 1;
    const { articles, firstPage, lastPage, totalPage } =
      await this.articlesService.allArticles(page);

    return { articles, firstPage, lastPage, totalPage };
  }

  // 게시글 상세 조회
  @Get('/:id')
  async findOneArticle(@Param('id') id: number) {
    const data = await this.articlesService.findOneArticle(id);
    return { data };
  }

  // 게시글 작성
  @Post('/')
  async postArticle(
    @Body() { title, contents, tags }: CreateArticleDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    let id = req.user;
    await this.articlesService.postArticle(title, contents, tags, id);
    return res.status(201).json(true);
  }

  // 게시글 수정
  @Put('/:id')
  async updateArticle(
    @Param('id') id,
    @Body() { title, contents, tags }: UpdateArticleDto,
    @Req() req: any,
  ) {
    const user_id = req.user;
    return await this.articlesService.updateArticle(
      id,
      title,
      contents,
      tags,
      user_id,
    );
  }

  // 게시글 삭제
  @Delete('/:id')
  async deleteArticle(@Param('id') id, @Req() req: any) {
    const user_id = req.user;
    return await this.articlesService.deleteArticle(id, user_id);
  }
}
