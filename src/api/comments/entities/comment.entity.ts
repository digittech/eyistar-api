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
    name: 'comments',
    orderBy: {
        timestamp: 'DESC',
    },
  })
  
  @Unique(['id'])
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', { name: 'user_id', nullable: true, length: 36 })
    user_id?: string;
  
    @Column('varchar', { name: 'post_id', nullable: true, length: 36 })
    post_id?: string;
  
    @Column('longtext', { name: 'comment'})
    comment?: string;

    @Column('int', { name: 'views', nullable: true, default: 0 })
    views?: number;

    @Column('enum', { name: 'status', nullable: true, default: 'active', enum: ['active', 'inactive'] })
    status?: string;
  
    @CreateDateColumn({ name: 'timestamp' })
    timestamp?: string;

    @ManyToOne((type) => User, (user) => user.comments, {eager: true})
    user?: User;
  
  }