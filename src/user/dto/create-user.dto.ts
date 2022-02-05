import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { Task } from 'src/task/schemas/task.schema';

export class CreateUserDto {

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  firstName: string;

  lastName: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  tasks: Task[];

  department: string;

  role: Role[];
}
