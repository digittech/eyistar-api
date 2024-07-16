import { Injectable } from '@nestjs/common';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostCategory } from './entities/post-category.entity';

@Injectable()
export class PostCategoryService {
  
  constructor(
    @InjectRepository(PostCategory) public postCategoryRepository: Repository<PostCategory>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  create(data: Partial<PostCategory>): Promise<PostCategory> {
    return this.postCategoryRepository.save(data);
  }

  findAll(): Promise<PostCategory[]> {
    return this.postCategoryRepository.find();
  }

  findOne(id: string): Promise<PostCategory> {
    return this.postCategoryRepository.findOne(id);
  }

  async update(id: string, data: Partial<PostCategory>) {
    const result = await this.postCategoryRepository.update(id, { ...data });
    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.postCategoryRepository.delete(id);
  }
}
