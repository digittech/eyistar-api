import { forwardRef, Module } from '@nestjs/common';
import { PostCategory } from './entities/post-category.entity';
import { PostCategoryService } from './post-category.service';
import { PostCategoryController } from './post-category.controller';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsService } from '../comments/comments.service';
import { Voting } from '../voting/entities/voting.entity';
import { VotingService } from '../voting/voting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../../services';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory, Post, Comment, Voting]), ServicesModule],
  controllers: [PostCategoryController],
  providers: [PostCategoryService, PostService, CommentsService, VotingService],
  exports: [PostCategoryService, PostService, CommentsService, VotingService],
})

export class PostCategoryModule {}
