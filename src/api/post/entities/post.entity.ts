import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PostCategory } from 'src/api/post-category/entities/post-category.entity';
import { User } from 'src/api/user/entities/user.entity';
@Entity({
  name: 'posts',
  orderBy: {
    created_at: 'DESC',
  },
})

@Unique(['id'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'user_id', nullable: true, length: 36 })
  user_id?: string;

  @Column('varchar', { name: 'post_category_id', nullable: true, length: 36 })
  post_category_id?: string;

  @Column('varchar', { name: 'title', nullable: true, length: 200 })
  title?: string;

  @Column('longtext', { name: 'content'})
  content?: string;

  @Column('longtext', { name: 'image'})
  image?: string;

  @Column('int', { name: 'views', nullable: true, default: 0 })
  views?: number;

  @Column('json', { name: 'tags', nullable: true, default: null })
  tags?: any;

  @Column('enum', { name: 'status', nullable: true, default: 'active', enum: ['active', 'inactive'] })
  status?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: string;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deleted_at?: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp?: string;

  @ManyToOne((type) => PostCategory, (postCategory) => postCategory.posts, {eager: true})
  post_category?: PostCategory;

  @ManyToOne((type) => User, (user) => user.posts, {eager: true})
  user?: User;

}