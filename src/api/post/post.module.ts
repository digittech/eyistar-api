import { forwardRef, Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostCategory } from '../post-category/entities/post-category.entity';
import { PostCategoryService } from '../post-category/post-category.service';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsService } from '../comments/comments.service';
import { Voting } from '../voting/entities/voting.entity';
import { VotingService } from '../voting/voting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../../services';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory, Comment, Voting]), ServicesModule],
  controllers: [PostController],
  providers: [PostService, PostCategoryService, CommentsService, VotingService],
  exports: [PostService, PostCategoryService, CommentsService, VotingService],
})

export class PostModule {}
