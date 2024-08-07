import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {
    IsEmail,
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
  import { IsName } from '../../../utils/validation.util';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    @ApiProperty()
    status: string;
}
