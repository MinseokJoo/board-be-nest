import { Controller, Get, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('/api/tags')
export class TagsController {
  constructor(private readonly tagsServices: TagsService) {}

  @Get('/today')
  async todayTags() {
    const yesterday =
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      (new Date().getDate() - 1);
    return await this.tagsServices.todayTags(yesterday);
  }

  @Get('/articles')
  async articlesByTag(@Query('tag') tag: string, @Query('page') page: number) {
    page = Number(page) || 1;
    return await this.tagsServices.articlesByTag(tag, page);
  }
}
