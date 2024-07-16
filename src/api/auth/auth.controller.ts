import {
  Body,
  Controller,
  forwardRef,
  Get,
  Param,
  Inject,
  Patch,
  Post,
  UseGuards,
  HttpException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './local-strategy/local.guard';
import { JwtGuard } from './jwt-strategy/jwt.guard';
import {
  error,
  success,
  Event,
} from '../../utils';
import { EventEmitter2 } from 'eventemitter2';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserService } from '../user';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto} from './dto/update-user.dto';
import { GetUser } from '../../decorators';
import * as moment from "moment";
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
const fs = require("fs");
const path = require("path");

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}


  @Post('user/registration')
  async userRegister(@Body() dataPayload: RegisterUserDto) {

    this.eventEmitter.emit(Event.USER_BEFORE_REGISTER, { dataPayload });
    let role = 'user';

    const regRes:any = await this.authService.registration(dataPayload, role);

    console.log('regRes', regRes);

    if (regRes.status) {
      let newUser = regRes.data;
      this.eventEmitter.emit(Event.NEVER_BOUNCE_VERIFY, { user: newUser });

      this.eventEmitter.emit(Event.USER_AFTER_REGISTER, {
        user: {
          ...newUser,
          password: null,
        },
      });
    
      const token = await this.authService.login(newUser);
  
      return success(
        {
          token: token.token,
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone_number: newUser.phone_number,
          gender: newUser.gender,
          image: newUser.image,
          password: null,
        },
        'User Registration',
        'User successfully registered',
      );
      
    } else {

      return error(
        'Registration Failed',
        regRes.message,
      );
      
    }

  }

  @Post('admin/registration')
  async adminRegister(@Body() dataPayload: RegisterUserDto) {

    this.eventEmitter.emit(Event.USER_BEFORE_REGISTER, { dataPayload });
    let role = 'admin';

    const regRes:any = await this.authService.registration(dataPayload, role);

    console.log('regRes', regRes);

    if (regRes.status) {
      let newUser = regRes.data;
      this.eventEmitter.emit(Event.NEVER_BOUNCE_VERIFY, { user: newUser });

      this.eventEmitter.emit(Event.USER_AFTER_REGISTER, {
        user: {
          ...newUser,
          password: null,
        },
      });
    
      const token = await this.authService.login(newUser);
  
      return success(
        {
          token: token.token,
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone_number: newUser.phone_number,
          gender: newUser.gender,
          image: newUser.image,
          password: null,
        },
        'User Registration',
        'User successfully registered',
      );
      
    } else {

      return error(
        'Registration Failed',
        regRes.message,
      );
      
    }

  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() user: LoginUserDto, @GetUser() authUser: User) {
    this.eventEmitter.emit(Event.USER_BEFORE_LOGIN, { user });
    const token = await this.authService.login(authUser);
    const userMeta = {
      // device_id: user?.device_id ?? authUser.device_id,
      // device_type: user?.device_type ?? authUser.device_type,
    }

    this.userService.update(authUser.id, userMeta);
    const {
      first_name,
      last_name,
      email,
      phone_number,
    } = authUser;

    this.eventEmitter.emit(Event.USER_AFTER_LOGIN, { user: { ...authUser, ...userMeta } });

    if (!authUser?.confirm_email) {
      throw new UnauthorizedException('Your email have not been verified.');
    }

    if (authUser?.status == "inactive") {
      throw new UnauthorizedException('Your account have not been activated by the admin');
    }

    // if (authUser?.post_status == 'suspended') {
    //   throw new UnauthorizedException('Your account is being reviewed, kindly reach out to us');
    // }

    else{
        return success(
          {
            token: token.token,
            id: authUser.id,
            first_name,
            last_name,
            email,
            image: authUser.image,
            phone_number,
            password: null,
            // acquire_hash: createHmac('sha256', this.configService.get('ACQUIRE_SECRET')).update(email).digest('hex'),
          },
          'Sign In',
          'Sign in was successful',
        );
    }

  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async user(@GetUser() authUser: User) {
    const user = await this.userService.findOne(authUser.id);
    return success(
      {
        ...user,
        password: null,
      },
      'User Profile',
      'User profile details',
    );
  }

}
