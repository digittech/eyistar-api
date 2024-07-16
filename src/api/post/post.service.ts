import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { VotingService } from '../voting/voting.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  
  constructor(
    @InjectRepository(Post) public postRepository: Repository<Post>,
    private readonly commentsService: CommentsService,
    private readonly votingService: VotingService
  ) {}

  create(data: Partial<Post>): Promise<Post> {
    return this.postRepository.save(data);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: string): Promise<Post> {
    return this.postRepository.findOne(id);
  }

  async findDetails(id: string){

     let post = await this.postRepository.findOne(id);

     if (post) {

      let otherDetails = await this.findOtherDetails(id);
     
      let upvote_count = otherDetails.upvote_count;
 
      let downvote_count = otherDetails.downvote_count;
 
      let reply_count = otherDetails.reply_count;
 
      return {
       ...post,
       upvote_count,
       downvote_count,
       reply_count
     };
      
     }
  }

  async findOtherDetails(id: string){
    
    let upvote_count = await this.votingService.votingRepository.count({where: {post_id: id, vote_type: 'up_vote'}});

    let downvote_count = await this.votingService.votingRepository.count({where: {post_id: id, vote_type: 'down_vote'}});

    let reply_count = await this.commentsService.commentRepository.count({where: {post_id: id}});

    return {
     upvote_count,
     downvote_count,
     reply_count
   };
 }

  async update(id: string, data: Partial<Post>) {
    const result = await this.postRepository.update(id, { ...data });
    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.postRepository.delete(id);
  }
}
