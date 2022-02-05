import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/schemas/user.schema';

export class TaskDto {

  @IsNotEmpty()
  name: string;
  description: string;
  user: User;

}
