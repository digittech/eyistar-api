import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  Length,
} from 'class-validator';

export class CreateVotingDto {

  @IsString()
  @Length(1, 36)
  @ApiProperty()
  post_id: string;

  @IsString()
  @IsEnum(['up_vote', 'down_vote'])
  @ApiProperty()
  vote_type: string;

}
