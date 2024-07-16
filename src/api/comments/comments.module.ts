import { forwardRef, Module } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Voting } from '../voting/entities/voting.entity';
import { VotingService } from '../voting/voting.service';
import { PostService } from '../post/post.service';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../../services';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Voting, Post, User]), ServicesModule],
  controllers: [CommentsController],
  providers: [CommentsService, VotingService, PostService, UserService],
  exports: [CommentsService, VotingService, PostService, UserService],
})

export class CommentsModule {}
