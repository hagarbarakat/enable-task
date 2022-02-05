import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/schemas/user.schema';
import * as mongoose from 'mongoose';

export class DepartmentDto {

  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  name: string;
  users: User[];

}
