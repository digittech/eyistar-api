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
  Injectable,
  HttpException
} from '@nestjs/common';
import {
  error,
  success,
  Event,
  hash,
  randomDigits,
  random,
  unifyPhoneNumber,
  mask,
  isNullOrUndefined,
} from '../../utils';
import { UserService } from '../user';
import { compare } from '../../utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as moment from "moment";
import { createHmac } from 'crypto';
import { Buffer } from 'buffer';

const fs = require("fs");
const path = require("path");

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(id: string): Promise<any> {
    return this.userService.findOne(id)
  }

  async validateUser(email: string, secret: string): Promise<any> {
    const user = await this.userService.userRepository.findOne({
      where: [{ email }],
    });
    if (user && compare(secret, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRY'),
    });
    return {
      id: user.id,
      token,
    };
  }

  async registration(data: any, role: string){
    try {

      let {
        first_name,
        last_name,
        email,
        password,
        image,
        phone_number,
        gender
      } = data; 

      const raw_phone_number = phone_number;
      phone_number = unifyPhoneNumber(phone_number);

      const existingUser = await this.userService.userRepository.findOne({
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

      let user_code = '' + randomDigits(12);
      while ((await customerIdExist(user_code)) === true) {
        user_code = '' + randomDigits(12);
      }

      let timeStamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS");
      const newUser = await this.userService.create({
        user_code,
        role,
        first_name,
        last_name,
        email,
        image,
        phone_number,
        gender,
        confirm_email: true,
        status: "active",
        password: hash(password),
        created_at: timeStamp,
        timestamp: timeStamp,
      });
    
      return {status: true, data: newUser, message: 'successfull'}

    } catch (e) {

      throw new HttpException(e.message, 500);

    }
  };
}
