import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class CreatePostCategoryDto {

  @IsOptional()
  @IsEnum(['', 'blog', 'quote', 'news'])
  @ApiProperty()
  service: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

}