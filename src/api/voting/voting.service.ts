import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Voting } from '../voting/entities/voting.entity';

@Injectable()
export class VotingService {
  
  constructor(
    @InjectRepository(Voting) public votingRepository: Repository<Voting>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  create(data: Partial<Voting>): Promise<Voting> {
    return this.votingRepository.save(data);
  }

  findAll(): Promise<Voting[]> {
    return this.votingRepository.find();
  }

  findOne(id: string): Promise<Voting> {
    return this.votingRepository.findOne(id);
  }

  async update(id: string, data: Partial<Voting>) {
    const result = await this.votingRepository.update(id, { ...data });
    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.votingRepository.delete(id);
  }
}

