import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Comment } from './comments.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async getCommentsByArticle(id: number) {
    return await this.commentsRepository.find({ where: { article_id: id } });
  }

  async postComment(article_id: number, user_id: number, contents: string) {
    return await this.commentsRepository.insert({
      article_id,
      user_id,
      contents,
    });
  }

  async updateComment(comment_id: number, user_id: number, contents: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: comment_id },
    });

    if (comment.user_id !== user_id) {
      throw new UnauthorizedException('This comment is not yours');
    }

    return await this.commentsRepository.update(
      { id: comment_id },
      { contents },
    );
  }

  async deleteComment(id: number, user_id: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (comment.user_id !== user_id) {
      throw new UnauthorizedException('This comment is not yours');
    }

    return await this.commentsRepository.softDelete(id);
  }
}
