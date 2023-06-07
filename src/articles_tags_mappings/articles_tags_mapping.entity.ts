import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from 'src/tags/tags.entity';
import { Article } from 'src/articles/articles.entity';

@Entity({ schema: 'tagBoard', name: 'articles_tags_mappings' })
export class Article_Tag_Mapping {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int')
  article_id: number;

  @Column('int')
  tag_id: number;

  @ManyToOne(() => Article, (article) => article.id)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.id)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
