import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetAllPostParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  per_page: number = 12;

  @ApiProperty({ required: false })
  @IsOptional()
  category_id?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}