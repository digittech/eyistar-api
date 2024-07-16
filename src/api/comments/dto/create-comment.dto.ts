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

export class CreateCommentDto {

@IsOptional()

  @IsString()
  @Length(1, 36)
  @ApiProperty()
  post_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  comment: string;

}