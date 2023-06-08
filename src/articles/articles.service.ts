import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './articles.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ArticlesRepository } from './articles.repotiroy';
import { TagsRepository } from 'src/tags/tags.repository';
import { Articles_Tags_MappingsRepository } from 'src/articles_tags_mappings/articles_tags_mappings.repository';

@Injectable()
export class ArticlesService {
  constructor(
    private articlesRepository: ArticlesRepository,
    private tagsRepository: TagsRepository,
    private articles_tags_mappingsRepository: Articles_Tags_MappingsRepository,
    private jwtService: JwtService,
  ) {}

  // 게시글 전체 조회
  async allArticles(page: number) {
    let [rows, count] = await this.articlesRepository.pagingArticles(page);
    count = Number(count);

    const articles = rows.map((row) => {
      return {
        id: row.id,
        title: row.title,
        contents: row.contents,
        count: row.count,
        author: row.user.email,
        createdAt: row.createdAt,
      };
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

  // 게시글 상세 조회
  async findOneArticle(id: number) {
    const findArticle = await this.articlesRepository.getArticleAndUserInfo(id);
    const findTags = await this.articles_tags_mappingsRepository.getTag(id);

    let tagArr = [];

    findTags.map((tag) => {
      tagArr.push(tag.tag.tag);
    });

    return {
      email: findArticle.user.email,
      title: findArticle.title,
      contents: findArticle.contents,
      createdAt: findArticle.createdAt,
      count: findArticle.count,
      tags: tagArr,
    };
  }

  // 게시글 작성
  async postArticle(
    title: string,
    contents: string,
    tags: string[],
    id: number,
  ) {
    let idArr = [];
    let tagArr = [];
    await Promise.all(
      tags.map(async (tag) => {
        const a = await this.tagsRepository.findOne({ where: { tag } });
        if (a) {
          idArr.push(a.id);
          tagArr.push(a.tag);
        }
        return;
      }),
    );

    tags = tags.map((tag) => String(tag));

    let notUsingTags = tags.filter((x) => !tagArr.includes(x));

    Promise.all(
      notUsingTags.map(async (tag) => {
        const insertResult = await this.tagsRepository.insert({ tag });
        return idArr.push(insertResult.identifiers[0].id);
      }),
    );

    const articleResult = await this.articlesRepository.postArticle(
      title,
      contents,
      id,
    );

    idArr.map((id) => {
      return this.articles_tags_mappingsRepository.insert({
        tag_id: id,
        article_id: articleResult.identifiers[0].id,
      });
    });
  }

  // 게시글 수정
  async updateArticle(
    id: number,
    title: string,
    contents: string,
    tags: string[],
    user_id: number,
  ) {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (article.user_id !== user_id) {
      throw new UnauthorizedException(`This article is not yours`);
    }

    await this.articles_tags_mappingsRepository.delete({ article_id: id });

    let idArr = [];
    let tagArr = [];

    // 태그를 찾는다.
    await Promise.all(
      tags.map(async (tag) => {
        const a = await this.tagsRepository.findOne({ where: { tag } });
        if (a) {
          idArr.push(a.id);
          tagArr.push(a.tag);
        }
        return;
      }),
    );

    // 태그를 string화 시킨다.
    tags = tags.map((tag) => String(tag));

    // body로 작성한 태그중 db에 있다면 생성할 태그에서 없앤다.
    let notUsingTags = tags.filter((x) => !tagArr.includes(x));

    // 없다면 만든다.
    await Promise.all(
      notUsingTags.map(async (tag) => {
        const insertResult = await this.tagsRepository.insert({ tag });
        return idArr.push(insertResult.identifiers[0].id);
      }),
    );

    // 매핑테이블에 넣는다.
    await Promise.all(
      idArr.map((tag_id) => {
        return this.articles_tags_mappingsRepository.insert({
          tag_id: tag_id,
          article_id: id,
        });
      }),
    );

    return await this.articlesRepository.update(id, { title, contents });
  }

  // 게시글 삭제
  async deleteArticle(id, user_id) {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (article.user_id !== user_id) {
      throw new UnauthorizedException(`This article is not yours`);
    }

    await this.articles_tags_mappingsRepository.delete({ article_id: id });

    return await this.articlesRepository.softDelete(id);
  }
}
