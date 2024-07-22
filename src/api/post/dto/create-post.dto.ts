import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class CreatePostDto {

@IsOptional()

  @IsString()
  @Length(1, 36)
  @ApiProperty()
  post_category_id: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  tags: [];

}