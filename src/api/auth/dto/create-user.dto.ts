import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { titleCase } from '../../../utils';
import { IsName } from '../../../utils/validation.util';

export class RegisterUserDto {

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

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;
  
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @ApiProperty()
  image: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty()
  phone_number: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  gender?: string;

}
