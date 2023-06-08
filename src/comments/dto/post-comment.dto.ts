import { IsString } from 'class-validator';

export class PostCommentDto {
  @IsString()
  readonly contents: string;
}
