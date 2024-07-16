import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetAllCommentParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  per_page: number = 12;

  @ApiProperty({ required: false })
  @IsOptional()
  post_id?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  user_id?: string = '';
}

export class GetAllCommentParamsbDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  per_page: number = 12;

  @ApiProperty({ required: false })
  @IsOptional()
  post_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  user_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}
