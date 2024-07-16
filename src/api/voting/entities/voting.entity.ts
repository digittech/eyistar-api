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
    name: 'votings',
    orderBy: {
        timestamp: 'DESC',
    },
  })
  
  @Unique(['id'])
  export class Voting {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', { name: 'user_id', nullable: true, length: 36 })
    user_id?: string;
  
    @Column('varchar', { name: 'post_id', nullable: true, length: 36 })
    post_id?: string;
  
    @Column('enum', { name: 'vote_type', nullable: true, enum: ['up_vote', 'down_vote'] })
    vote_type?: string;
  
    @CreateDateColumn({ name: 'timestamp' })
    timestamp?: string;
  
  }