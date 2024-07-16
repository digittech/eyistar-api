import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetAllPostCategoryParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  per_page: number = 12;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string = '';
}