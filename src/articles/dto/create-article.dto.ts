import { IsArray, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;

  @IsArray()
  readonly tags: string[];
}
