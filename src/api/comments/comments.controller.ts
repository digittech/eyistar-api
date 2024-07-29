import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetAllCommentParamsDto } from './dto/quary-params.dto';
import { User } from '../user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Like} from 'typeorm';
import * as moment from "moment";
const fs = require("fs");
const path = require("path");
const word:any= '';

@ApiTags('Comment Management')
@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService
    ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async create(@Body() createCommentDto: CreateCommentDto, @GetUser() authUser: User) {

    let {
      post_id,
      comment
    } = createCommentDto;
    let user_id = authUser.id;

    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      const createdComment = await this.commentsService.create({
        post_id,
        user_id,
        comment,
        timestamp: timeStamp
      });
  
      if (createdComment) {
  
        let newcomment = await this.commentsService.findOne(createdComment.id);
  
        return success(
          newcomment,
          'Completed',
          'New comment created successfully',
        );
        
      } else {
  
        return error('failed', 'Something went wrong, Kindly check your input and try again')
        
      }
      
    } catch (error) {
      throw new HttpException(error.message, 500);
    }

  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() params: GetAllCommentParamsDto,
  ) {

    let {
      page,
      per_page,
      post_id,
      user_id,
      search,
    } = params;
    const _page = +page < 1 ? 1 : +page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _per_page = +per_page
    const _filter = {
      take: per_page,
      skip: (page - 1) * per_page,
      where: [
        'comment',
      ].map((column) => ({post_id: Like(`%${post_id}%`), user_id: Like(`%${user_id}%`), [column]: Like(`%${search}%`) })),
    }

    const total = await this.commentsService.commentRepository.count(_filter);
    const comments = await this.commentsService.commentRepository.find({
                                                                take: per_page,
                                                                skip: (page - 1) * per_page,
                                                                where: [
                                                                  'comment',
                                                                ].map((column) => ({post_id: Like(`%${post_id}%`), user_id: Like(`%${user_id}%`), [column]: Like(`%${search}%`)})),
                                                                order: {
                                                                  timestamp: "DESC",
                                                              },
    }) ;
    console.log('comments', comments);

    return success(
      comments,
      'Get All',
      'All commnent replies',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _per_page,
        total,
      }
    );
  }

  @Get('active')
  @ApiBearerAuth()
  async findAllActive(
    @Query() params: GetAllCommentParamsDto,
  ) {

    let {
      page,
      per_page,
      post_id,
      user_id,
      search,
    } = params;
    const _page = +page < 1 ? 1 : +page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _per_page = +per_page
    const _filter = {
      take: per_page,
      skip: (page - 1) * per_page,
      where: [
        'comment',
      ].map((column) => ({status: 'active', post_id: Like(`%${post_id}%`), user_id: Like(`%${user_id}%`), [column]: Like(`%${search}%`) })),
    }

    const total = await this.commentsService.commentRepository.count(_filter);
    const comments = await this.commentsService.commentRepository.find({
                                                                take: per_page,
                                                                skip: (page - 1) * per_page,
                                                                where: [
                                                                  'comment',
                                                                ].map((column) => ({status: 'active', post_id: Like(`%${post_id}%`), user_id: Like(`%${user_id}%`), [column]: Like(`%${search}%`)})),
                                                                order: {
                                                                  timestamp: "DESC",
                                                              },
    }) ;
    console.log('comments', comments);

    return success(
      comments,
      'Get All',
      'All commnent replies',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _per_page,
        total,
      }
    );
  }

  @Get('active/:id')
  @ApiBearerAuth()
  async findOneActive(@Param('id') id: string) {

    try {

      let comment = await this.commentsService.findOne(id);

      if (comment) {

        let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
        const updated = await this.commentsService.update(id, 
        { 
          views: comment.views + 1,
          timestamp: timeStamp
        });

        return success(
          comment,
          'Get Comment by ID',
          'Comment details',
        );
        
      } else {

        return error('failed', 'Post not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
  }
  
  // @Get('post/:post_id')
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  // async findAllActive(@Param('post_id') post_id: string) {
  //   try {

  //     const comments = await this.commentsService.commentRepository.find({
  //       where: [{ post_id: post_id }],
  //     }) ?? null;
      
  //     return success(
  //       comments,
  //       'Get Post Replies',
  //       'All comment by post ID',
  //     );
      
  //   } catch (error) {

  //     throw new HttpException(error.message, 500);

  //   }

  // }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {

      let comment = await this.commentsService.findOne(id);

      if (comment) {

        let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
        const updated = await this.commentsService.update(id, 
        { 
          views: comment.views + 1,
          timestamp: timeStamp
        });

        return success(
          comment,
          'Get Comment by ID',
          'Comment details',
        );
        
      } else {

        return error('failed', 'Post not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @GetUser() authUser: User) {

    let {
      post_id,
      comment
    } = updateCommentDto;

    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      let getComment = await this.commentsService.findOne(id);

      if (getComment) {

        if (getComment.user_id != authUser.id) {
          return error('Somthing went wrong', 'You can only update your comment');
        }

        const updated = await this.commentsService.update(id, 
          { 
            post_id,
            comment,
            timestamp: timeStamp
          });
    
          let newComment = await this.commentsService.findOne(id);

          return success(
            newComment,
            'Done',
            'Comment updated successfully',
          );
        
      } else {
        return error('failed', 'Comment not found');
      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
      
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @GetUser() authUser: User) {

    try {

      let comment = await this.commentsService.findOne(id);

      if (comment) {

        if (comment.user_id != authUser.id) {
          return error('Somthing went wrong', 'You can only delete your comment');
        }

        const deletedComment = await this.commentsService.remove(id);

        if (deletedComment) {
    
          return success(
            {
              id,
            },
            'Done',
            'Comment deleted successfully',
          );
          
        } else {
    
          return error(
            'Delete Failed',
            'Somthing went wrong',
          );
          
        }
        
      } else {

        return error('failed', 'Post not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }

  }
}
