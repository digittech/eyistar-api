import { timestamp } from 'aws-sdk/clients/cloudfront';
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
import { Comment } from 'src/api/comments/entities/comment.entity';
@Entity({
  name: 'users',
  // orderBy: {
  //   email: 'ASC',
  // },
})

@Unique(['id'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { name: 'role', nullable: true, enum: ['admin', 'user'] })
  role?: string;

  @Column('varchar', { name: 'user_code', nullable: true, length: 36 })
  user_code?: string;

  @Column('varchar', { name: 'first_name', nullable: true, length: 52 })
  first_name?: string;

  @Column('varchar', { name: 'last_name', nullable: true, length: 52 })
  last_name?: string;

  @Column('varchar', { name: 'email', nullable: true, length: 52 })
  email?: string;

  @Column('boolean', { name: 'confirm_email', default: false })
  confirm_email?: boolean;

  @Column('varchar', { name: 'password', length: 255 })
  password?: string;

  @Column('varchar', { name: 'phone_number', nullable: true, length: 26 })
  phone_number?: string;

  @Column('varchar', { name: 'gender', nullable: true, length: 26 })
  gender?: string;

  @Column('longtext', { name: 'image'})
  image?: string;

  @Column('varchar', { name: 'email_token', nullable: true, length: 20 })
  email_token?: string;

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

  @OneToMany((type) => Post, (post) => post.user)
  posts?: Post;

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments?: Comment;
}
