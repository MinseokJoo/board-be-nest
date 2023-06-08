import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PostCommentDto } from './dto/post-comment.dto';
import { Request } from 'express';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:article_id')
  async getCommentsByArticle(@Param('article_id') id: number) {
    const articleComments = await this.commentsService.getCommentsByArticle(id);
    return { articleComments };
  }

  @Post('/:article_id')
  async postComment(
    @Param('article_id') article_id: number,
    @Body() { contents }: PostCommentDto,
    @Req() req: any,
  ) {
    const user_id = req.user;
    return await this.commentsService.postComment(
      article_id,
      user_id,
      contents,
    );
  }

  @Put('/:comment_id')
  async updateComment(
    @Param('comment_id') id: number,
    @Req() req: any,
    @Body() { contents }: UpdateCommentDto,
  ) {
    const user_id = req.user;

    return await this.commentsService.updateComment(id, user_id, contents);
  }

  @Delete('/:comment_id')
  async deleteComment(@Param('comment_id') id: number, @Req() req: any) {
    const user_id = req.user;
    return await this.commentsService.deleteComment(id, user_id);
  }
}
