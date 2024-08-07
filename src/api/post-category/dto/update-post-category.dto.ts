import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostCategoryDto } from './create-post-category.dto';
import {
    IsEmail,
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
  import { IsName } from '../../../utils/validation.util';

export class UpdatePostCategoryDto extends PartialType(CreatePostCategoryDto) {
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    @ApiProperty()
    status: string;
}
