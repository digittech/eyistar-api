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
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { JwtGuard } from '../auth/jwt-strategy/jwt.guard';
import { GetUser } from '../../decorators';
import { PostCategoryService } from '../post-category/post-category.service';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetAllPostParamsDto } from './dto/quary-params.dto';
import { User } from '../user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Like } from 'typeorm';
import * as moment from "moment";
import { timestamp } from 'rxjs/operators';
const fs = require("fs");
const path = require("path");
const word:any= '';

@ApiTags('Post Management')
@Controller('post')
export class PostController {

  private readonly bucketName = process.env.MINIO_BUCKET_NAME;
  
  constructor(
  @Inject(forwardRef(() => PostService))
  private readonly postService: PostService,
  private readonly minioClientService: MinioClientService,
  private readonly postCategoryService: PostCategoryService,
  ) {}


  async uploadFileToMinio(data){

    let {
      base64,
      image_name,
      bucket_name
    } = data;

    const uploadMinio = await this.minioClientService.upload(data);

    console.log(`File uploaded successfully. ${uploadMinio}`);

    const fileUrl = uploadMinio.url;
    
    console.log('fileUrl', fileUrl);

    if (uploadMinio) {
      return {status: 200, message: 'File uploaded successfully', fileUrl: fileUrl};
    } else {
      return {status: 404, message: 'File not uploaded', fileUrl: ''};
    }
 
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async create(@Body() createPostDto: CreatePostDto, @GetUser() authUser: User) {

    let {
      post_category_id,
      title,
      content,
      image,
      tags,
      description,
      shows_date,
      end_date,
    } = createPostDto;

    let now = moment().format();
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    const postCategory = await this.postService.postRepository.findOne({
      where: [{ title: title, post_category_id: post_category_id }],
    }) ?? null;

    // Reject Duplication
    if (postCategory) {
      return error('Failed', 'Looks like the post title already exist');
    }

    let userImage = '';
    if (image == '') {

        userImage = "https://konnect-minio-api.konnectbd.com/checkbucket/.png_1696887482709.png";

      } else if (image == "https://konnect-minio-api.konnectbd.com/checkbucket/.png_1696887482709.png") {

      userImage = "https://konnect-minio-api.konnectbd.com/checkbucket/.png_1696887482709.png";

      } else{
      
        const imageName = `user_${title.replace(' ', "_")}`

      let minioData = {
        base64: image,
        image_name: imageName,
        bucket_name: this.bucketName
      };
  
      userImage = (await this.uploadFileToMinio(minioData)).fileUrl;
    }

    try {

      const createdPost = await this.postService.create({
        post_category_id,
        user_id: authUser.id,
        title,
        content,
        image: userImage,
        tags,
        description,
        is_hidden: false,
        shows_date,
        end_date,
        status: 'active',
        created_at: todatsDate,
        timestamp: timeStamp
      });
  
      if (createdPost) {
  
        let newPost = await this.postService.findDetails(createdPost.id);
  
        return success(
          {
            id: newPost.id,
            username: `${newPost.user.first_name} ${newPost.user.last_name}`,
            user_image: newPost.user.image,
            user_email: newPost.user.email,
            category: newPost.post_category.name,
            title: newPost.title,
            content: newPost.content,
            post_image: newPost.image,
            tags: newPost.tags,
            status: newPost.status,
            created_at: newPost.created_at,
          },
          'Completed',
          'New post created successfully',
        );
        
      } else {
  
        return error('failed', 'Something went wrong, Kindly check your input and try again')
        
      }
      
    } catch (error) {
      throw new HttpException(error.message, 500);
    }

  }

  @Get('my_post')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAllUserPost(
    @GetUser() authUser: User,
    @Query() params: GetAllPostParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    const category_id= params.category_id;
    const search = params.search;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: [
        'title',
        'content',
      ].map((column) => ({user_id: authUser.id, post_category_id: Like(`%${category_id}%`), [column]: Like(`%${search}%`) })),
    }

    const total = await this.postService.postRepository.count(_filter);
    const posts = await this.postService.postRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: [
                                                                  'title',
                                                                  'content',
                                                                ].map((column) => ({user_id: authUser.id, post_category_id: Like(`%${category_id}%`), [column]: Like(`%${search}%`) })),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    }) ;
    console.log('posts', posts);

    let allPost = [];
    for (let index = 0; index < posts.length; index++) {
      const data = posts[index];
      let otherDetails =  await this.postService.findOtherDetails(data.id);
      await allPost.push({
        id: data.id,
        category_id: data.post_category_id,
        category: data.post_category.name,
        user_information: {
          user_id: data.user_id,
          username: `${data.user.first_name} ${data.user.last_name}`,
          user_image: data.user.image,
          user_email: data.user.email,
        },
        title: data.title,
        content: data.content,
        tags: data.tags,
        post_image: data.image,
        views: data.views,
        description: data.description,
        is_hidden: data.is_hidden,
        shows_date: data.shows_date,
        end_date: data.end_date,
        upvote_count: otherDetails.upvote_count,
        downvote_count: otherDetails.downvote_count,
        reply_count: otherDetails.reply_count,
        status: data.status,
        created_at: data.created_at,
        timestamp: data.timestamp,
      })
    }

    return success(
      allPost,
      'Get All',
      'All post list',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() params: GetAllPostParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    const category_id= params.category_id;
    const search = params.search;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: [
        'title',
        'content',
      ].map((column) => ({post_category_id: Like(`%${category_id}%`), [column]: Like(`%${search}%`) })),
    }

    const total = await this.postService.postRepository.count(_filter);
    const posts = await this.postService.postRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: [
                                                                  'title',
                                                                  'content',
                                                                ].map((column) => ({post_category_id: Like(`%${category_id}%`), [column]: Like(`%${search}%`) })),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    }) ;
    console.log('posts', posts);

    let allPost = [];
    for (let index = 0; index < posts.length; index++) {
      const data = posts[index];
      let otherDetails =  await this.postService.findOtherDetails(data.id);
      await allPost.push({
        id: data.id,
        category_id: data.post_category_id,
        user_information: {
          user_id: data.user_id,
          username: `${data.user.first_name} ${data.user.last_name}`,
          user_image: data.user.image,
          user_email: data.user.email,
        },
        category: data.post_category.name,
        title: data.title,
        content: data.content,
        post_image: data.image,
        views: data.views,
        tags: data.tags,
        description: data.description,
        is_hidden: data.is_hidden,
        shows_date: data.shows_date,
        end_date: data.end_date,
        upvote_count: otherDetails.upvote_count,
        downvote_count: otherDetails.downvote_count,
        reply_count: otherDetails.reply_count,
        status: data.status,
        created_at: data.created_at,
        timestamp: data.timestamp,
      })
    }

    return success(
      allPost,
      'Get All',
      'All post list',
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
  @ApiBearerAuth()
  async findAllActive(
    @Query() params: GetAllPostParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    const category_id= params.category_id;
    const search = params.search;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: [
        'title',
        'content',
      ].map((column) => ({post_category_id: Like(`%${category_id}%`), status: 'active', [column]: Like(`%${search}%`) })),
    }

    const total = await this.postService.postRepository.count(_filter);
    const posts = await this.postService.postRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: [
                                                                  'title',
                                                                  'content',
                                                                ].map((column) => ({post_category_id: Like(`%${category_id}%`), status: 'active', [column]: Like(`%${search}%`) })),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    }) ;
    console.log('posts', posts);

    let allPost = [];
    for (let index = 0; index < posts.length; index++) {
      const data = posts[index];
      let otherDetails =  await this.postService.findOtherDetails(data.id);
      await allPost.push({
        id: data.id,
        category_id: data.post_category_id,
        user_information: {
          user_id: data.user_id,
          username: `${data.user.first_name} ${data.user.last_name}`,
          user_image: data.user.image,
          user_email: data.user.email,
        },
        category: data.post_category.name,
        title: data.title,
        content: data.content,
        post_image: data.image,
        views: data.views,
        tags: data.tags,
        description: data.description,
        is_hidden: data.is_hidden,
        shows_date: data.shows_date,
        end_date: data.end_date,
        upvote_count: otherDetails.upvote_count,
        downvote_count: otherDetails.downvote_count,
        reply_count: otherDetails.reply_count,
        status: data.status,
        created_at: data.created_at,
        timestamp: data.timestamp,
      })
    }

    return success(
      allPost,
      'Get All',
      'All post list',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get('category/:category_id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAllCategory(@Param('category_id') category_id: string) {
    try {

      const posts = await this.postService.postRepository.find({
        where: [{ post_category_id: category_id}],
      }) ?? null;

      let allPost = [];
      for (let index = 0; index < posts.length; index++) {
        const data = posts[index];
        let otherDetails =  await this.postService.findOtherDetails(data.id);
        await allPost.push({
          id: data.id,
          category_id: data.post_category_id,
          user_information: {
            user_id: data.user_id,
            username: `${data.user.first_name} ${data.user.last_name}`,
            user_image: data.user.image,
            user_email: data.user.email,
          },
          category: data.post_category.name,
          title: data.title,
          content: data.content,
          post_image: data.image,
          views: data.views,
          description: data.description,
          is_hidden: data.is_hidden,
          shows_date: data.shows_date,
          end_date: data.end_date,
          upvote_count: otherDetails.upvote_count,
          downvote_count: otherDetails.downvote_count,
          reply_count: otherDetails.reply_count,
          status: data.status,
          created_at: data.created_at,
          timestamp: data.timestamp,
        })
      }

      
      return success(
        allPost,
        'Active Post',
        'All acive post by category',
      );
      
    } catch (error) {

      throw new HttpException(error.message, 500);

    }

  }

  @Get('active/category/:category_id')
  @ApiBearerAuth()
  async findAllActiveCategory(@Param('category_id') category_id: string) {
    try {

      const posts = await this.postService.postRepository.find({
        where: [{ post_category_id: category_id, status: 'active' }],
      }) ?? null;

      let allPost = [];
      for (let index = 0; index < posts.length; index++) {
        const data = posts[index];
        let otherDetails =  await this.postService.findOtherDetails(data.id);
        await allPost.push({
          id: data.id,
          category_id: data.post_category_id,
          user_information: {
            user_id: data.user_id,
            username: `${data.user.first_name} ${data.user.last_name}`,
            user_image: data.user.image,
            user_email: data.user.email,
          },
          category: data.post_category.name,
          title: data.title,
          content: data.content,
          post_image: data.image,
          views: data.views,
          description: data.description,
          is_hidden: data.is_hidden,
          shows_date: data.shows_date,
          end_date: data.end_date,
          upvote_count: otherDetails.upvote_count,
          downvote_count: otherDetails.downvote_count,
          reply_count: otherDetails.reply_count,
          status: data.status,
          created_at: data.created_at,
          timestamp: data.timestamp,
        })
      }

      
      return success(
        allPost,
        'Active Post',
        'All acive post by category',
      );
      
    } catch (error) {

      throw new HttpException(error.message, 500);

    }

  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {

      let post = await this.postService.findDetails(id);

      if (post) {

        let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
        const updated = await this.postService.update(id, 
        { 
          views: post.views + 1,
          timestamp: timeStamp
        });

        return success(
          {
            id: post.id,
            category_id: post.post_category_id,
            user_information: {
              user_id: post.user_id,
              username: `${post.user.first_name} ${post.user.last_name}`,
              user_image: post.user.image,
              user_email: post.user.email,
            },
            category: post.post_category.name,
            title: post.title,
            content: post.content,
            post_image: post.image,
            views: post.views,
            description: post.description,
            is_hidden: post.is_hidden,
            shows_date: post.shows_date,
            end_date: post.end_date,
            upvote_count: post.upvote_count,
            downvote_count: post.downvote_count,
            reply_count: post.reply_count,
            status: post.status,
            created_at: post.created_at,
            timestamp: post.timestamp,
          },
          'Get Post by ID',
          'Post details',
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
  async update(@Param('id') id: string, @Body() UpdatePostDto: UpdatePostDto, @GetUser() authUser: User) {

    let {
      post_category_id,
      title,
      content,
      image,
      description,
      shows_date,
      end_date,
      status
    } = UpdatePostDto;

    let now = moment().format();
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      let post = await this.postService.findOne(id);

      if (post) {

        if (post.user_id != authUser.id) {
          return error('Somthing went wrong', 'You can only update your post');
        }

        const updated = await this.postService.update(id, 
          { 
            post_category_id,
            title,
            content,
            image,
            description,
            is_hidden: false,
            shows_date,
            end_date,
            status,
            timestamp: timeStamp
          });
    
          let newPost = await this.postService.findOne(id);

          return success(
            {
              id: newPost.id,
              username: `${newPost.user.first_name} ${newPost.user.last_name}`,
              user_image: newPost.user.image,
              user_email: newPost.user.email,
              category: newPost.post_category.name,
              title: newPost.title,
              // content: newPost.content,
              post_image: newPost.image,
              status: newPost.status,
              created_at: newPost.created_at,
              timestamp: newPost.timestamp,
            },
            'Done',
            'Post category updated successfully',
          );
        
      } else {
        return error('failed', 'Post not found');
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

      let post = await this.postService.findOne(id);

      if (post) {

        if (post.user_id != authUser.id) {
          return error('Somthing went wrong', 'You can only delete your post');
        }

        const deletedPost = await this.postService.remove(id);

        if (deletedPost) {
    
          return success(
            {
              id,
            },
            'Done',
            'Post deleted successfully',
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
