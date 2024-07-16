import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { titleCase } from '../../../utils';
import { date } from '../../../utils/time.utils';
import { IsName } from '../../../utils/validation.util';

export class UpdateUserDto {

  @IsString()
  @Length(1, 52)
  @ApiProperty()
  role_id: string;
  
  @IsString()
  @Length(1, 52)
  @ApiProperty()
  permission_id: string;

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

  // @IsOptional()
  // @IsString()
  // @Length(1, 26)
  // @ApiProperty()
  // password: string;

  @IsOptional()
  @ApiProperty()
  image: string;

  @IsNumberString()
  @Length(1, 15)
  @ApiProperty()
  phone_number: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 10)
  // @ApiPropertyOptional()
  // gender?: string;
  
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

export class UpdateUserCodeDto {
  @IsString()
  @Length(1, 8)
  @ApiProperty()
  code: string;
}

export class UpdateEmailDto {
  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;
}