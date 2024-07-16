import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  
  constructor(
    @InjectRepository(Comment) public commentRepository: Repository<Comment>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  create(data: Partial<Comment>): Promise<Comment> {
    return this.commentRepository.save(data);
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  findOne(id: string): Promise<Comment> {
    return this.commentRepository.findOne(id);
  }

  async update(id: string, data: Partial<Comment>) {
    const result = await this.commentRepository.update(id, { ...data });
    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.commentRepository.delete(id);
  }
}
