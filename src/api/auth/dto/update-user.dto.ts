import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { titleCase } from '../../../utils';
import { date } from '../../../utils/time.utils';
import { IsName } from '../../../utils/validation.util';

export class UpdateProfileDto {

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  first_name: string;

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  last_name: string;

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  username: string;

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;

  @IsString()
  @Length(1, 52)
  @ApiProperty()
  role_id: string;

  @IsOptional()
  @ApiProperty()
  image: string;

  @IsNumberString()
  @Length(1, 11)
  @ApiProperty()
  phone_number: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  @ApiPropertyOptional()
  gender?: string;
  
  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiPropertyOptional()
  home_address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiPropertyOptional()
  state_of_residence?: string;

  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiPropertyOptional()
  lga?: string;

  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiPropertyOptional()
  geo_political_zone?: string;

}

export class LoginUserDto {

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;

  @IsString()
  @Length(1, 26)
  @ApiProperty()
  password: string;

}