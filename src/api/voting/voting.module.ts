import { forwardRef, Module } from '@nestjs/common';
import { Voting } from './entities/voting.entity';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { PostService } from '../post/post.service';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../../services';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsService } from '../comments/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voting, Post, Comment, User]), ServicesModule],
  controllers: [VotingController],
  providers: [VotingService, PostService, CommentsService, UserService],
  exports: [VotingService, PostService, CommentsService, UserService],
})

export class VotingModule {}
