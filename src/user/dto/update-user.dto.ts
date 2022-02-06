import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

  @IsNotEmpty()
  @ApiProperty()
  username: string;

}
