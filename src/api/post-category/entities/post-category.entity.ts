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
import { Post } from 'src/api/post/entities/post.entity';
@Entity({
  name: 'post_categories',
  orderBy: {
    name: 'ASC',
  },
})

@Unique(['id'])
export class PostCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name?: string;

  @Column('varchar', { name: 'description', nullable: true, length: 200 })
  description?: string;

  @Column('enum', { name: 'status', nullable: true, default: 'active', enum: ['active', 'inactive'] })
  status?: string;

  @Column('varchar', { name: 'created_by', nullable: true, length: 50 })
  created_by?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: string;

  @Column('varchar', { name: 'updated_by', nullable: true, length: 50 })
  updated_by?: string;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updated_at?: string;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deleted_at?: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp?: string;

  @OneToMany((type) => Post, (post) => post.post_category)
  posts?: Post;

}
