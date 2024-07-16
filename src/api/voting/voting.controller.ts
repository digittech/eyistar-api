import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  forwardRef,
  Inject,
  Query,
  HttpException,
} from '@nestjs/common';
import {
  error,
  success,
} from '../../utils';
import { JwtGuard } from '../auth/jwt-strategy/jwt.guard';
import { GetUser } from '../../decorators';
import { VotingService } from './voting.service';
import { CreateVotingDto } from './dto/create-voting.dto';
import { User } from '../user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Like } from 'typeorm';
import * as moment from "moment";

@ApiTags('Voting Management')
@Controller('voting')
export class VotingController {

  constructor(@Inject(forwardRef(() => VotingService))
  private readonly votingService: VotingService
  ) {}

  @Get('upvote/:post_id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async upVote(@Param('post_id') post_id: string, @GetUser() authUser: User) {

    let vote_type = 'up_vote';
    let user_id = authUser.id;
    let vote_id;

    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");

    try {

      const voting = await this.votingService.votingRepository.findOne({
        where: [{ post_id, user_id }],
      }) ?? null;

      if (voting) {

        // Reject Duplication
    
        if (voting.vote_type == vote_type) {

          const deletedVote = await this.votingService.remove(voting.id);
          return success(
            {},
            'Done',
            'Voting Canceled',
          );
        }
        
        const updatedVoting = await this.votingService.update(voting.id, {
          vote_type,
          timestamp: timeStamp
        });
        
      } else {

        const createdVote = await this.votingService.create({
          post_id,
          vote_type,
          user_id,
          timestamp: timeStamp
        });

        vote_id = createdVote.id;
        
      }
  
        let newvoting = await this.votingService.findOne(vote_id);
  
        return success(
          newvoting,
          'Done',
          'Voting successfully',
        );
      
    } catch (error) {
      throw new HttpException(error.message, 500);
    }

  }

  @Get('downvote/:post_id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async downVote(@Param('post_id') post_id: string, @GetUser() authUser: User) {
    
    
    let vote_type = 'down_vote';
    let user_id = authUser.id;
    let vote_id;

    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");

    try {

      const voting = await this.votingService.votingRepository.findOne({
        where: [{ post_id, user_id }],
      }) ?? null;

      if (voting) {

        vote_id = voting.id;

        // Reject Duplication
    
        if (voting.vote_type == vote_type) {

          const deletedVote = await this.votingService.remove(voting.id);
          return success(
            {},
            'Done',
            'Voting Canceled',
          );
        }
        
        const updatedVoting = await this.votingService.update(voting.id, {
          vote_type,
          timestamp: timeStamp
        });
        
      } else {

        const createdVote = await this.votingService.create({
          post_id,
          vote_type,
          user_id,
          timestamp: timeStamp
        });

        vote_id = createdVote.id;
        
      }
  
        let newvoting = await this.votingService.findOne(vote_id);
  
        return success(
          newvoting,
          'Done',
          'Voting successfully',
        );
      
    } catch (error) {
      throw new HttpException(error.message, 500);
    }

  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(
    @Query('page') page: number = 1,
    @Query('per_page') perPage: number = 12,
    @Query('user_id') user_id?: string,
    @Query('vote_type') vote_type?: string,
  ) {
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {user_id: Like(`%${user_id}%`), vote_type: Like(`%${vote_type}%`)},
    }

    const total = await this.votingService.votingRepository.count(_filter);
    const voteings = await this.votingService.votingRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: {user_id: Like(`%${user_id}%`), vote_type: Like(`%${vote_type}%`)},
                                                                order: {
                                                                  timestamp: "DESC",
                                                              },
    }) ;
    console.log('voteings', voteings);

    return success(
      voteings,
      'Get All',
      'All votings',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {

      let vote = await this.votingService.findOne(id);

      if (vote) {

        return success(
          vote,
          'Get Vote by ID',
          'Vote details',
        );
        
      } else {

        return error('failed', 'Vote not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
  }

}
