import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article_Tag_Mapping } from 'src/articles_tags_mappings/articles_tags_mapping.entity';

@Entity({ schema: 'tagBoard', name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { length: 50 })
  tag: string;

  @OneToMany(
    () => Article_Tag_Mapping,
    (article_tag_mapping) => article_tag_mapping.id,
  )
  articles_tags_mappings: Article_Tag_Mapping;

  @CreateDateColumn()
  createdAt: Date;
}
