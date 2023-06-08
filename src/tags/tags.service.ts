import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { Articles_Tags_MappingsRepository } from 'src/articles_tags_mappings/articles_tags_mappings.repository';

@Injectable()
export class TagsService {
  constructor(
    private tagsRepository: TagsRepository,
    private articles_tags_mappingsRespotiroy: Articles_Tags_MappingsRepository,
  ) {}

  async todayTags(yesterday) {
    const tags = await this.articles_tags_mappingsRespotiroy.todayTags(
      yesterday,
    );

    let tagsArr = [];
    await Promise.all(
      tags.map((tag) => {
        return tagsArr.push(tag['tag.id_tag']);
      }),
    );

    return tagsArr;
  }

  async articlesByTag(tag: string, page) {
    const { id: tag_id } = await this.tagsRepository.findOne({
      where: { tag },
      select: ['id'],
    });

    const articles = await this.articles_tags_mappingsRespotiroy.articlesByTag(
      tag_id,
      page,
    );

    const count = await this.articles_tags_mappingsRespotiroy.countBy({
      tag_id,
    });

    let totalPage = Math.ceil(count / 8);

    let pageGroup = Math.ceil(page / 5);

    let lastPage = pageGroup * 5;

    let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

    if (lastPage > totalPage) {
      lastPage = totalPage;
    }

    return {
      articles,
      firstPage,
      lastPage,
      totalPage,
    };
  }
}
