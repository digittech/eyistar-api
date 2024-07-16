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
  HttpService,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt-strategy/jwt.guard';
import { GetUser } from '../../decorators';
import { ExportService } from 'src/services/export/export.service';
import {
  error,
  Event,
  hash,
  randomDigits,
  success,
  unifyPhoneNumber,
} from '../../utils';
import { UserService } from './user.service';
import {
  UpdateUserDto,
} from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import * as moment from "moment";
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Like } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
const AWS = require('aws-sdk');
const {Buffer} = require('buffer');
const fs = require("fs");

const path = require("path");
const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");

@ApiTags('User Managements')
@Controller('users')
export class UserController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly exportService: ExportService,
    private httpService: HttpService,

  ) {}


  async uploadFileToAws(file){

    const s3 = new AWS.S3({
        // region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_S3_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY
    });

    const fileName = file.name;
    const setPath = (filename) => `${process.env.FILE_PATH}/${filename}`;
    const awsLink = `${process.env.FILE_URL}/${process.env.FILE_PATH}/${fileName}`;

    // return setPath(fileName);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${setPath(fileName)}.${file.type}`,
        Body: file.data,
        ContentEncoding: 'base64',
        ContentType: `image/${file.type}`,
        // ACLs: 'public-read'
        };

        const res:any = await new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => err == null ? resolve(data) : reject(err));
        });

      console.log(`File uploaded successfully. ${res.Location}`);

      if (res) {
        return {status: 200, message: 'File uploaded successfully', fileUrl: res.Location};
      } else {
        return {status: 404, message: 'File not uploaded', fileUrl: ''};
      }
      
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto, @GetUser() authUser: User) {
    this.eventEmitter.emit(Event.USER_BEFORE_REGISTER, { createUserDto });
    const password = createUserDto.first_name+'.' + randomDigits(8);
    console.log(password);
    let {
      role,
      first_name,
      last_name,
      email,
      phone_number,
    } = createUserDto; 

    const raw_phone_number = phone_number;
    phone_number = unifyPhoneNumber(phone_number);

    const existingUser =
      await this.userService.userRepository.findOne({
        select: ['id', 'phone_number', 'email'],
        where: [{ phone_number: raw_phone_number }, { phone_number }, { email }],
      }) ?? null;

    // enforce unique phone number code
    if (existingUser?.phone_number === raw_phone_number || existingUser?.phone_number === phone_number) {
      return error('Registration', 'Looks like you already have an account. Phone number already exist');
    }

    // enforce unique email code
    if (existingUser?.email === email) {
      return error('Registration', 'Looks like you already have an account. Email already exist');
    }

    // generate user customer id
    const customerIdExist = async (id: string) => {
      const user = await this.userService.userRepository.findOne({
        id,
      });
      return !!user?.id;
    };

    let userCustomerId = '' + randomDigits(8);
    while ((await customerIdExist(userCustomerId)) === true) {
      userCustomerId = '' + randomDigits(8);
    }

    const newUser = await this.userService.create({
      role,
      first_name,
      last_name,
      email,
      phone_number,
      image: "user.png",
      confirm_email: true,
      status: "active",
      password: hash(password),
      created_by: authUser.id,
      created_at: timeStamp,
      updated_at: timeStamp,
      updated_by: authUser.id,
    });

    this.eventEmitter.emit(Event.NEVER_BOUNCE_VERIFY, { user: newUser });

    this.eventEmitter.emit(Event.USER_AFTER_REGISTER, {
      user: {
        ...newUser,
        password: null,
      },
    });

    return success(
      {
        user:{
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone_number: newUser.phone_number,
          gender: newUser.gender,
          image: newUser.image,
          password: null,
          email_valid: false,
          status: false,
          post_status: 'pending',
        },
      },
      
      'User Registration',
      'User successfully registered',
    );
  }

  @Get('search')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async search(
    @Query('role') role?: any,
    @Query('query') query?: string,
    @Query('per_page') perPage: number = 12,
  ) {
    let users;

    if(role == 0){
      users = await this.userService.userRepository.find({
        where: [
          'first_name',
          'last_name',
          'phone_number',
          'email',
          'user_code',
        ].map((column) => ({ [column]: Like(`%${query}%`) })),
        skip: 0,
        take: perPage,
      });
    }else{
      users = await this.userService.userRepository.find({
        where: [
          'first_name',
          'last_name',
          'phone_number',
          'email',
          'bvn',
          'user_code',
        ].map((column) => ({[ column]: Like(`%${query}%`) })),
        skip: 0,
        take: perPage,
      });
    }

    const total = users.length
    return success(
      users.map((user) => {
        return {
          ...user,
          password: null,
        };
      }),
      'Users',
      'Users list',
      {
        current_page: 1,
        next_page: null,
        prev_page: null,
        per_page: total,
        total,
      }
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(
    @Query('page') page: number = 1,
    @Query('per_page') perPage: number = 12,
    @Query('query') query?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,
    }
    const total = await this.userService.userRepository.count(_filter);
    const users = await this.userService.userRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    });
    return success(
      users.map((user) => {
        return {
          ...user,
          password: null,
        };
      }),
      'Users',
      'Users list',
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
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return success(
      user ? {
        ...user,
        password: null,
      } : null,
      'Users',
      'User details',
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    // console.log(user);
    // return user.image;

    let userCustomerId = '' + randomDigits(8);

    let fileName = '';
    if (user.image == '') {
      const useer = await this.userService.findOne(id);
       fileName = useer.image;
    } else {
      const imageName = user.first_name.replace(' ', "_")+`_${userCustomerId}`
      const base64Data = new Buffer.from(user.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const type = user.image.split(';')[0].split('/')[1];
      const uploaded = await this.uploadFileToAws({name: imageName, type: type, data:base64Data});
      fileName = uploaded.fileUrl;
    }

   const result = await this.userService.update(id, {
      ...user,
      ...(user?.image ? { image: fileName } : {}),
      ...(user?.phone_number ? { phone_number: user.phone_number } : {})
    });

    return success(
      {
        id,
        user: await this.userService.findOne(id)
      },
      'Users',
      'User details updated',
    );
  }
  

}
