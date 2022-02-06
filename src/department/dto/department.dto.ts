import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto {

  @IsNotEmpty()
  @ApiProperty()
  name: string;
  users: User[];

}
