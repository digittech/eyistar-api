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
import { PostCategoryService } from './post-category.service';
import { PostService } from '../post/post.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { GetAllPostCategoryParamsDto } from './dto/quary-params.dto';
import { User } from '../user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Like} from 'typeorm';
import * as moment from "moment";
const fs = require("fs");
const path = require("path");
const word:any= '';

@ApiTags('Post Category')
@Controller('post-category')
export class PostCategoryController {
  
  constructor(
  @Inject(forwardRef(() => PostCategoryService))
  private readonly postCategoryService: PostCategoryService,
  private readonly postService: PostService
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async create(@Body() createPostCategoryDto: CreatePostCategoryDto, @GetUser() authUser: User) {

    let {
      service,
      name,
      description,
    } = createPostCategoryDto;

    const slug = name.replace(/\w+/g, function(txt) {
      // uppercase first letter and add rest unchanged
      return txt.charAt(0).toLocaleLowerCase() + txt.substr(1);
    }).replace(/\s/g, '_');

    const existingServiceCat = await this.postCategoryService.postCategoryRepository.findOne({
      where: [{ name: name }],
    }) ?? null;

    // Reject Duplication
    if (existingServiceCat) {
      return error('Failed', 'Looks like the post category name already exist');
    }

    let now = moment().format();
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      const createdPostCategory = await this.postCategoryService.create({
        name,
        description,
        service,
        slug,
        status: 'active',
        created_by: authUser.id,
        created_at: todatsDate,
        timestamp: timeStamp
      });
  
      if (createdPostCategory) {
  
        let newPostCategory = await this.postCategoryService.findOne(createdPostCategory.id);
  
        return success(
          {
            id: newPostCategory.id,
            service: newPostCategory.service,
            name: newPostCategory.name,
            description: newPostCategory.description,
            status: newPostCategory.status,
            created_by: newPostCategory.created_by,
            created_at: newPostCategory.created_at,
          },
          'Completed',
          'New post category created successfully',
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
    @Query() params: GetAllPostCategoryParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    const search = params.search;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: [
        'name',
        'description',
      ].map((column) => ({[column]: Like(`%${search}%`) })),
    }

    const total = await this.postCategoryService.postCategoryRepository.count(_filter);
    const postCategories = await this.postCategoryService.postCategoryRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: [
                                                                  'name',
                                                                  'description',
                                                                ].map((column) => ({[column]: Like(`%${search}%`) })),
                                                                order: {
                                                                  name: "ASC",
                                                              },
    }) ;
    console.log('postCategories', postCategories);

    return success(
      postCategories.map((data) => {
        return {
          id: data.id,
          name: data.name,
          service: data.service,
          slug: data.slug,
          description: data.description,
          status: data.status,
          created_by: data.created_by,
          created_at: data.created_at,
          timestamp: data.timestamp,
        };
      }),
      'Get All',
      'All post categories',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get('active')
  // @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAllActive() {
    try {

      const categories = await this.postCategoryService.postCategoryRepository.find({
        select: ['id', 'name', 'service', 'slug', 'description', 'timestamp'],
        where: [{ status: 'active' }],
      }) ?? null;
      
      return success(
        categories ?? null,
        'Get All Actives',
        'Active post categories',
      );
      
    } catch (error) {

      throw new HttpException(error.message, 500);

    }

  }

  @Get('active/:service')
  // @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAllActiveService(@Param('service') service: string) {
    try {

      const categories = await this.postCategoryService.postCategoryRepository.find({
        select: ['id', 'name', 'service', 'slug', 'description', 'timestamp'],
        where: [{ status: 'active', service: service}],
      }) ?? null;
      
      return success(
        categories ?? null,
        'Get All Actives Service',
        'Service active post categories',
      );
      
    } catch (error) {

      throw new HttpException(error.message, 500);

    }

  }

  @Get(':id')
  // @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {

      let category = await this.postCategoryService.findOne(id);

      if (category) {

        return success(
          category ? {
            ...category
          } : null,
          'Get details by ID',
          'Post category details',
        );
        
      } else {

        return error('failed', 'Category not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
  }

  @Get('slug/:slug')
  // @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findBySlug(@Param('slug') slug: string) {

    try {

      let category = await this.postCategoryService.postCategoryRepository.findOne({where: {slug}});

      if (category) {

        return success(
          category ? {
            ...category
          } : null,
          'Get details by ID',
          'Post slug details',
        );
        
      } else {

        return error('failed', 'Category not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updatePostCategoryDto: UpdatePostCategoryDto, @GetUser() authUser: User) {

    let {
      service,
      name,
      description,
      status
    } = updatePostCategoryDto;

    const slug = name.replace(/\w+/g, function(txt) {
      // uppercase first letter and add rest unchanged
      return txt.charAt(0).toLocaleLowerCase() + txt.substr(1);
    }).replace(/\s/g, '_');

    let now = moment().format();
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      let category = await this.postCategoryService.findOne(id);

      if (category) {
        const updated = await this.postCategoryService.update(id, 
          { 
            name,
            service,
            slug,
            description,
            status,
            updated_by: authUser.id,
            updated_at: todatsDate,
            timestamp: timeStamp
          });
    
          return success(
            await this.postCategoryService.findOne(id),
            'Done',
            'Post category updated successfully',
          );
        
      } else {
        return error('failed', 'Category not found');
      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }
      
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {

    try {

      let category = await this.postCategoryService.findOne(id);

      if (category) {

        const postCategory = await this.postCategoryService.remove(id);

        if (postCategory) {
    
          const post = await this.postService.postRepository.delete({post_category_id: id});
    
          return success(
            {
              id,
              post
            },
            'Done',
            'Post Category deleted successfully',
          );
          
        } else {
    
          return error(
            'Delete Failed',
            'Somthing went wrong',
          );
          
        }
        
      } else {

        return error('failed', 'Category not found');

      }

    } catch (error) {

      throw new HttpException(error.message, 500);
    }

  }
}
